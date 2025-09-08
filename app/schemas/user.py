from pydantic import BaseModel,EmailStr

class UserBase(BaseModel):
    email: EmailStr
    
class UserCreate(UserBase):
    name:str
    password:str
    
class UserLogin(UserBase):
    password:str
    
class UserResponse(UserBase):
    id:int
    name:str
    
    class Config:
        orm_mode = True
    