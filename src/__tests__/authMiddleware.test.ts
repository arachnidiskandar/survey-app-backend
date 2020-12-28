import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import config from '@config/config';
import AuthMiddleware from '@middlewares/authMiddleware';
import User from '@models/user';

describe('test authMiddleware', () => {
  let user;
  let mockRequest;
  let mockResponse;
  let mockNext;
  beforeAll(async (done) => {
    await mongoose.connect(config.mongo.uri, config.mongo.options);
    done();
  });
  beforeEach(() => {
    user = {
      name: 'test',
      email: 'test@gmail.com',
      password: '123456',
      coordinator: true,
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    mockRequest = {
      cookies: {
        jwt: null,
      },
    };
  });
  afterEach(async (done) => {
    await User.deleteMany({}).exec();
    done();
  });
  afterAll(async (done) => {
    await mongoose.connection.close();
    done();
  });

  it('shouldnt authorize without token', () => {
    const newUser = new User(user);
    newUser.save().then(() => {
      AuthMiddleware(mockRequest, mockResponse, mockNext);
      expect(mockNext).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });
  });
  it('shouldnt allow unauthorized user', () => {
    user.coordinator = false;
    const newUser = new User(user);
    newUser.save().then(() => {
      AuthMiddleware(mockRequest, mockResponse, mockNext);
      expect(mockNext).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });
  });
  it('shouldnt authorize with invalid token', () => {
    const newUser = new User(user);
    newUser.save().then(() => {
      mockRequest.cookies.jwt = '1213';
      AuthMiddleware(mockRequest, mockResponse, mockNext);
      expect(mockNext).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });
  });
  it('should authorize user', () => {
    const newUser = new User(user);
    newUser.save().then(() => {
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: 24 * 60 * 60 });
      mockRequest.cookies.jwt = token;
      AuthMiddleware(mockRequest, mockResponse, mockNext);
      expect(mockNext).toHaveBeenCalled();
    });
  });
});
