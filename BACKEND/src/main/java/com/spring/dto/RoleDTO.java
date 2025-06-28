package com.spring.dto;

public class RoleDTO {
    private int RoleID;
    private String RoleName;

    public RoleDTO() {}

    public RoleDTO(int RoleID, String RoleName) {
        this.RoleID = RoleID;
        this.RoleName = RoleName;
    }
    public int getRoleID() {
        return RoleID;
    }
    public void setRoleID(int RoleID) {
        this.RoleID = RoleID;
    }
    public String getRoleName() {
        return RoleName;
    }
    public void setRoleName(String RoleName) {
        this.RoleName = RoleName;
    }

}
