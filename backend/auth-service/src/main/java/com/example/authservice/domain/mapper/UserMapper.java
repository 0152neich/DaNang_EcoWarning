package com.example.authservice.domain.mapper;

import com.example.authservice.domain.dto.request.RegisterUserRequest;
import com.example.authservice.domain.dto.response.UserResponse;
import com.example.authservice.domain.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public abstract class UserMapper {

    public abstract User toUser(RegisterUserRequest registerUserRequest);
    public abstract UserResponse toUserResponse(User user);
}

