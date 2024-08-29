import AlreadyExistsException from 'src/Common/Domain/Exceptions/AlreadyExistsException';
import NotValidInputException from 'src/Common/Domain/Exceptions/NotValidInput';
import { RegisterUseCaseImpl } from 'src/User/Application/UseCases/Commands/Register/RegisterImpl';
import User from 'src/User/Domain/User';
import UserStatus from 'src/User/Domain/UserStatus';

describe('user register', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });
  it('should give invalid input ', async () => {
    const hashService = {
      createHash: jest.fn(),
      compare: jest.fn(),
    };
    const userRepo = {
      load: async () => {
        return null;
      },
      loadByEmail: async () => {
        return null;
      },
      save: jest.fn(),
    };
    const registerImpl = new RegisterUseCaseImpl(hashService, userRepo);

    expect(
      registerImpl.execute({
        confirmPassword: 'ehsasnPassword',
        password: 'ehsasn',
        email: 'ehsan@gmail.com',
        ip: '127.1.1.1',
        name: 'ehsan',
      }),
    ).rejects.toThrow(NotValidInputException);
  });

  it('should give already exists user ', () => {
    const hashService = {
      createHash: jest.fn(),
      compare: jest.fn(),
    };
    const userRepo = {
      load: async () => {
        return null;
      },
      loadByEmail: async () => {
        const user = new User();
        user.status = UserStatus.EMAIL_VERIFIED;
        return user;
      },
      save: jest.fn(),
    };
    const registerImpl = new RegisterUseCaseImpl(hashService, userRepo);

    expect(
      registerImpl.execute({
        confirmPassword: 'ehsasnPassword',
        password: 'ehsasnPassword',
        email: 'ehsan@gmail.com',
        ip: '127.1.1.1',
        name: 'ehsan',
      }),
    ).rejects.toThrow(AlreadyExistsException);
  });

  it('should register  user ', () => {
    const hashService = {
      createHash: jest.fn(),
      compare: jest.fn(),
    };
    const userRepo = {
      load: async () => {
        return null;
      },
      loadByEmail: async () => {
        return null;
      },
      save: jest.fn(),
    };
    const registerImpl = new RegisterUseCaseImpl(hashService, userRepo);

    expect(
      registerImpl.execute({
        confirmPassword: 'ehsasnPassword',
        password: 'ehsasnPassword',
        email: 'ehsan@gmail.com',
        ip: '127.1.1.1',
        name: 'ehsan',
      }),
    ).resolves.toBeUndefined();
  });
});
