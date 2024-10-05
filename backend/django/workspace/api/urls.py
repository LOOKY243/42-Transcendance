from django.urls import path
from .views import (
    RegisterView, 
    LoginView, 
    GetUserView, 
    LogoutView, 
    UpdateLanguageView, 
    UpdatePasswordView, 
    UpdateUsernameView, 
    UpdateProfilePictureView, 
    GetProfilePictureView, 
    SearchUserView, 
    AddFriendView, 
    GetFriendListView, 
    RemoveFriendView, 
    GetUserInformations, 
    OAuth42Login, 
    OAuth42Callback, 
    GetUserDataView,
    DeleteProfilePictureView,
    DeleteAccountView,
    ValidateGameSettingsView,
    NewMailView,
    TwoFactorSetupView, 
    TwoFactorVerifyView, 
    TwoFactorActivateView,
    UpdateEmailView,
    DeleteEmailView,
    RecordMatchResultView,
    LastMatchInfoView,
    ValidateBattleSettingsView,
    CreateTournamentView,
    AddUsersAndGenerateMatchesView,
    NextMatchesView,
    NextRoundView,
    MatchListView,
    CloseTournamentView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('getUser/', GetUserView.as_view(), name='getUser'),
    path('updateLanguage/', UpdateLanguageView.as_view(), name='updateLanguage'),
    path('updatePassword/', UpdatePasswordView.as_view(), name='updatePassword'),
    path('updateUsername/', UpdateUsernameView.as_view(), name='updateUsername'),
    path('updatePfp/', UpdateProfilePictureView.as_view(), name='updatePfp'),
    path('deletePfp/',  DeleteProfilePictureView.as_view(), name='deletePfp'),
    path('getPfp/', GetProfilePictureView.as_view(), name='getPfp'),
    path('searchUser/', SearchUserView.as_view(), name='searchUser'),
    path('addFriend/', AddFriendView.as_view(), name='add-friend'),
    path('getFriendsList/', GetFriendListView.as_view(), name='getFriendList'),
    path('removeFriend/', RemoveFriendView.as_view(), name='removeFriend'),
    path('getUserInformations/', GetUserInformations.as_view(), name='getUserInformations'),
    path('42auth/login/', OAuth42Login.as_view(), name='oauth42_login'),
    path('42auth/callback/', OAuth42Callback.as_view(), name='oauth42_callback'),
    path('getUserData/', GetUserDataView.as_view(), name='get_user_data'),
    path('deleteUser/', DeleteAccountView.as_view(), name='delete-account'),
    path('newMail/', NewMailView.as_view(), name='newMail'),
    path('patchMail/', UpdateEmailView.as_view(), name='patchMail'),
    path('2faActivate/', TwoFactorActivateView.as_view(), name='two_factor_activate'),
    path('2faSetup/', TwoFactorSetupView.as_view(), name='two_factor_setup'),
    path('2faVerify/', TwoFactorVerifyView.as_view(), name='two_factor_verify'),
    path('deleteMail/', DeleteEmailView.as_view(), name='deleteMail'),
    path('recordGame/', RecordMatchResultView.as_view(), name='recordGame'),
    path('lastMatchInformations/', LastMatchInfoView.as_view(), name='lastMatchInformations'),
    path('startNewPong/', ValidateGameSettingsView.as_view(), name='validatedParamsNewPong'),
    path('startNewBattle/', ValidateBattleSettingsView.as_view(), name='validatedParamsNewBattle'),
    path('tournament/create/', CreateTournamentView.as_view(), name='create-tournament'),
    path('tournament/addUsers/', AddUsersAndGenerateMatchesView.as_view(), name='add-users-and-generate-matches'),
    path('tournament/nextMatches/', NextMatchesView.as_view(), name='next-matches'),
    path('tournament/nextRound/', NextRoundView.as_view(), name='next-round'),
    path('tournament/matchList/', MatchListView.as_view(), name='match-list'),
    path('tournament/close/', CloseTournamentView.as_view(), name='close-tournament'),

]
