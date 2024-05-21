export interface CreateUsersReq {
  id: string;
  firstName: string;
  lastName: string;
  birthdate: Date;
  email: string;
  location: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateUsersRequest implements CreateUsersReq {
  id: string;
  firstName: string;
  lastName: string;
  birthdate: Date;
  email: string;
  location: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(req: CreateUsersReq) {
    this.id = req.id;
    this.firstName = req.firstName;
    this.lastName = req.lastName;
    this.birthdate = req.birthdate;
    this.email = req.email;
    this.location = req.location;
    this.createdAt = req.createdAt;
    this.updatedAt = req.updatedAt;
  }

  validate(): Error | null {
    if (this.firstName === "") {
      return new Error("first name can't be empty");
    }
    if (this.lastName === "") {
      return new Error("last name can't be empty");
    }
    if (this.email === "") {
      return new Error("email can't be empty");
    }
    if (this.birthdate === null || isNaN(this.birthdate.getTime())) {
      return new Error("birthdate must have valid date");
    }
    if (this.location === "") {
      return new Error("location can't be empty");
    }
    return null;
  }
}

// export interface TypeRequestBody<CreateUsersRequest> extends Request {
//   body: CreateUsersReq;
// }

export interface CreateUsersResp {
  message: string;
}

export interface UpdateUsersReq {
  firstName: string;
  lastName: string;
  birthdate: Date;
  email: string;
  location: string;
}

export class UpdateUsersRequest implements UpdateUsersReq {
  firstName: string;
  lastName: string;
  birthdate: Date;
  email: string;
  location: string;

  constructor(req: UpdateUsersReq) {
    this.firstName = req.firstName;
    this.lastName = req.lastName;
    this.birthdate = req.birthdate;
    this.email = req.email;
    this.location = req.location;
  }
}
