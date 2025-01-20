import { bcryptAdapter } from '../../config';
import { UserModel } from '../../data';
import { CustomError, RegisterUserDto, UserEntity } from '../../domain';

export class AuthService {
	constructor() {}

	public async registerUser(registerUserDto: RegisterUserDto) {
		const existUser = await UserModel.findOne({ email: registerUserDto.email });

		if (existUser) throw CustomError.badRequest('Email already exist');

		try {
			const user = new UserModel(registerUserDto);

			// Encriptar la contraseña
			user.password = bcryptAdapter.hash(registerUserDto.password);

			await user.save();
			// JWT - mantenet la autentacion del usuario

			// Email de confirmacion

			const { password, ...userEntity } = UserEntity.fromObject(user);

			return {
				user: userEntity,
				token: 'ABC'
			};
		} catch (error) {
			throw CustomError.internalServer(`${error}`);
		}
	}
}
