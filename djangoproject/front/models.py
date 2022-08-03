from django.db import models

class CountyList(models.Model):
    county = models.CharField(max_length=5)

class TownList(models.Model):
    town = models.CharField(max_length=5)
    county = models.ForeignKey(CountyList, on_delete=models.CASCADE)


class Join(models.Model):
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=45)
    address = models.CharField(max_length=255)
    town = models.ForeignKey(TownList, on_delete=models.CASCADE)
    type = models.CharField(max_length=5)