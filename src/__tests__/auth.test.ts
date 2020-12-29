import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import request from 'supertest';

import config from '@config/config';
import User from '@models/user';

import app from '../app';

describe('Test auth endpoint', () => {
  let user;
  beforeEach(async (done) => {
    user = {
      name: 'Augusto Rafael',
      email: 'dashsdiasuidhi@gmail.com',
      password: '123456',
      confirmPass: '123456',
      coordinator: false,
    };
    mongoose
      .connect(config.mongo.uri, config.mongo.options)
      .then(done())
      .catch((err) => console.log(err.message));
  });
  afterEach(async (done) => {
    await User.deleteMany({}).exec();
    await mongoose.connection.close();
    done();
  });
  afterAll(async (done) => {
    await mongoose.connection.close();
    done();
  });

  it('should register new user', async (done) => {
    const response = await request(app).post('/api/signup').send(user);
    expect(response.body.email).toBe('dashsdiasuidhi@gmail.com');
    expect(response.status).toBe(201);
    done();
  });
  it('should not register user without name', async (done) => {
    delete user.name;
    const response = await request(app).post('/api/signup').send(user);
    expect(response.status).toBe(400);
    done();
  });
  it('should not register user without email', async (done) => {
    delete user.email;
    const response = await request(app).post('/api/signup').send(user);
    expect(response.status).toBe(400);
    done();
  });
  it('should not register user without password', async (done) => {
    delete user.password;
    const response = await request(app).post('/api/signup').send(user);
    expect(response.status).toBe(400);
    done();
  });
  it('should not register user without confirmPass', async (done) => {
    delete user.confirmPass;
    const response = await request(app).post('/api/signup').send(user);
    expect(response.status).toBe(400);
    done();
  });
  it('should not register user with passwords not matching', async (done) => {
    user.confirmPass = 'outra senha';
    const response = await request(app).post('/api/signup').send(user);
    expect(response.status).toBe(400);
    done();
  });
  it('should not register user without coordinator', async (done) => {
    delete user.coordinator;
    const response = await request(app).post('/api/signup').send(user);
    expect(response.status).toBe(400);
    done();
  });
  it('should not allow register email twice', async (done) => {
    await request(app).post('/api/signup').send(user);
    const response = await request(app).post('/api/signup').send(user);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Email Already Exists');
    done();
  });
  it('should login user', async (done) => {
    bcrypt
      .hash(user.password, 10)
      .then((hash) => {
        const newUser = new User({
          name: user.name,
          password: hash,
          email: user.email,
          coordinator: false,
        });
        newUser.save().then(async () => {
          const response = await request(app).post('/api/login').send({ email: user.email, password: '123456' });
          expect(response.status).toBe(200);
          expect(response.body.user).toBe(newUser.id);
          done();
        });
      })
      .catch((err) => console.log(err));
  });
  it('should not login with incorrect password', async (done) => {
    bcrypt
      .hash(user.password, 10)
      .then((hash) => {
        const newUser = new User({
          name: user.name,
          password: hash,
          email: user.email,
          coordinator: false,
        });
        newUser.save().then(async () => {
          const response = await request(app).post('/api/login').send({ email: user.email, password: 'senha errada' });
          expect(response.status).toBe(404);
          expect(response.body.message).toBe('Email or password invalid');
          done();
        });
      })
      .catch((err) => console.log(err));
  });
  it('should not login with incorrect email', async (done) => {
    bcrypt
      .hash(user.password, 10)
      .then((hash) => {
        const newUser = new User({
          name: user.name,
          password: hash,
          email: user.email,
          coordinator: false,
        });
        newUser.save().then(async () => {
          const response = await request(app).post('/api/login').send({ email: 'email', password: '123456' });
          expect(response.status).toBe(404);
          expect(response.body.message).toBe('Email or password invalid');
          done();
        });
      })
      .catch((err) => console.log(err));
  });
});
