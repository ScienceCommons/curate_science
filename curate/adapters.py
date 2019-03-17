from invitations.models import Invitation
from curate.models import UserProfile
from allauth.account.adapter import DefaultAccountAdapter

class AccountAdapter(DefaultAccountAdapter):
    def save_user(self, request, user, form):
        data = form.cleaned_data
        email = data.get('email')
        user.email = email

        if 'password1' in data:
            user.set_password(data["password1"])
        else:
            user.set_unusable_password()

        try:
            invite = Invitation.objects.get(email=email)
            user.username = invite.userprofile.slug
            user.save()
            profile = invite.userprofile
            profile.user = user
            profile.save()
            #import pdb; pdb.set_trace()
        except:
            user.save()
            profile = UserProfile.objects.create(user=user)
            profile.save()
            user.username = profile.slug
            user.save()
        return user
