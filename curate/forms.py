from django import forms
from allauth.account.forms import SignupForm

class CustomSignupForm(SignupForm):
    email = forms.EmailField(label='E-mail')
    #name = forms.CharField(label='Full Name:')

    # def save(self, request):
    #     user = super(MyCustomSignupForm, self).save(request, commit=False)

    #     return user

    class Meta:
        fields = ('name', 'email', 'password1', 'password2', )
