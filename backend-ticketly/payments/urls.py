from django.urls import path
from . import views

urlpatterns = [
    path("add-money/",views.add_money_view),
    path("payments/",views.payments),
    path("wallet-balance/",views.wallet_balance_view),
    path("payment-confirmation/<int:id>",views.payment_confirmation_view)
]
