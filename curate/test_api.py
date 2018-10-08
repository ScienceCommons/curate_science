from django.test import TestCase
from django.test import Client
from django.shortcuts import reverse
from curate import models
from curate.test_setup import create_model_instances

class TestAPIViews(TestCase):
    def setUp(self):
        create_model_instances()
        self.client = Client()
        admin_user = User.objects.create(username='admin')
        admin_user.set_password('password')
        admin_user.save()

        anon_user = User.objects.create(username='new_user')
        anon_user.set_password('password1')
        anon_user.save()
