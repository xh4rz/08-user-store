import { bcryptAdapter, JwtAdapter } from '../../config';
import { UserModel } from '../../data';
import {
	CustomError,
	LoginUserDto,
	RegisterUserDto,
	UserEntity
} from '../../domain';

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

	public async loginUser(loginUserDto: LoginUserDto) {
		const user = await UserModel.findOne({ email: loginUserDto.email });

		if (!user) throw CustomError.badRequest('Email not exist');

		const isMatching = bcryptAdapter.compare(
			loginUserDto.password,
			user.password
		);

		if (!isMatching) throw CustomError.badRequest('Password is not valid');

		const { password, ...userEntity } = UserEntity.fromObject(user);

		const token = await JwtAdapter.generateToken({
			id: user.id,
			email: user.email
		});

		if (!token) throw CustomError.internalServer('Error while creating JWT');

		return {
			user: userEntity,
			token: token
		};
	}
}
