from django.db import models
from django.contrib.auth.models import AbstractUser, PermissionsMixin
from django.contrib.auth.models import Group, Permission

# Mảng các vai trò được phép
ROLES = (
    ('thành viên', 'Thành viên'),
    ('nhân viên', 'Nhân viên'),
    ('khách hàng', 'Khách hàng'),
    ('admin', 'Admin'),
    ('cộng tác viên', 'Cộng tác viên'),
    ('kế toán', 'Kế toán'),
    ('quản lý', 'Quản lý'),
    ('công chứng viên', 'Công chứng viên'),
)

class User(AbstractUser, PermissionsMixin):
    full_name = models.CharField(max_length=255, blank=True)
    phone_number = models.CharField(max_length=15, unique=True, null=True, blank=True)
    email = models.EmailField(unique=True, null=True, blank=True)
    role = models.CharField(max_length=50, choices=ROLES, default='thành viên')
    is_active = models.BooleanField(default=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name']

    # Sửa lỗi xung đột: Thêm related_name
    groups = models.ManyToManyField(
        Group,
        related_name='user_auth_users',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='user_auth_user_permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

    def __str__(self):
        return self.email or self.phone_number