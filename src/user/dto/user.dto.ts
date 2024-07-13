    export class CreateUserDto{
        readonly user_id:       String;
        readonly name:          String;
        readonly password:      String;
        readonly house_number:  number;
        readonly roles       :  String;
        readonly phone_number:  number;
        readonly address:       String;
    }

    export class UpdateUserDto {
        readonly user_id:       String;
        readonly name:          String;
        readonly house_number:  number;
        readonly roles       :  String;
        readonly phone_number:  number;
        readonly address:       String;
    }