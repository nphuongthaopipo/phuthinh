from rest_framework import serializers
from .models import User
from django.contrib.auth import authenticate

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    confirm_password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = ('full_name', 'email', 'phone_number', 'password', 'confirm_password')
        extra_kwargs = {
            'email': {'required': False},
            'phone_number': {'required': False},
        }

    def validate(self, attrs):
        if not attrs.get('email') and not attrs.get('phone_number'):
            raise serializers.ValidationError("Bạn phải nhập Email hoặc Số điện thoại.")
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Mật khẩu không khớp."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(
            username=validated_data.get('email') or validated_data.get('phone_number'),
            email=validated_data.get('email'),
            phone_number=validated_data.get('phone_number'),
            full_name=validated_data.get('full_name'),
            password=validated_data['password'],
        )
        return user

class UserLoginSerializer(serializers.Serializer):
    email_or_phone = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    def validate(self, attrs):
        email_or_phone = attrs.get('email_or_phone')
        password = attrs.get('password')

        if not email_or_phone or not password:
            raise serializers.ValidationError("Cần nhập cả Email/SĐT và Mật khẩu.")

        user = None
        if '@' in email_or_phone:
            try:
                user = User.objects.get(email=email_or_phone)
            except User.DoesNotExist:
                pass
        else:
            try:
                user = User.objects.get(phone_number=email_or_phone)
            except User.DoesNotExist:
                pass

        if user and user.check_password(password):
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError("Thông tin đăng nhập không hợp lệ.")