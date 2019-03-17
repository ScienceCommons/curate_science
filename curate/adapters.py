from invitations.models import Invitation
from curate.models import UserProfile
from django.conf import settings
from allauth.account.adapter import DefaultAccountAdapter

class AccountAdapter(DefaultAccountAdapter):
    def is_open_for_signup(self, request):
        if hasattr(request, 'session') and request.session.get(
                'account_verified_email'):
            return True
        elif settings.INVITATIONS_INVITATION_ONLY is True:
            # Site is ONLY open for invites
            return False
        else:
            # Site is open to signup
            return True

    def get_user_signed_up_signal(self):
        return user_signed_up

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
            profile = UserProfile.objects.create(user=user)
            profile.save()
            user.username = profile.slug
            user.save()
        return user
