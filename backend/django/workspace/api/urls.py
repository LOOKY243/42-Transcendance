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
    EncryptUserDataView,
    DecryptUserDataView,
    GetUserDataView,
    DeleteProfilePictureView,
    DeleteAccountView,
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
    path('encryptUser/', EncryptUserDataView.as_view(), name='encrypt_user_data'),
    path('decryptUser/', DecryptUserDataView.as_view(), name='decrypt_user_data'),
    path('getUserData/', GetUserDataView.as_view(), name='get_user_data'),
    path('deleteUser/', DeleteAccountView.as_view(), name='delete-account'),
]
