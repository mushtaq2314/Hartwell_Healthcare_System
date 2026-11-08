from pydantic import BaseModel, EmailStr

class AdminLogin(BaseModel):
    email: EmailStr
    password: str
    
    def __repr__(self) -> str:
        return str(self.model_dump(exclude={"password"}))
    
    def __str__(self) -> str:
        return self.__repr__()