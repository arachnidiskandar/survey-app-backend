import mongoose from 'mongoose';
import request from 'supertest';

import config from '@config/config';
import survey from '@models/survey';

import app from '../app';

describe('Test survey endpoint', () => {
  beforeEach(async (done) => {
    mongoose
      .connect(config.mongo.uri, config.mongo.options)
      .then(done())
      .catch((err) => console.log(err.message));
  });
  afterEach(async (done) => {
    await survey.deleteMany({});
    mongoose
      .disconnect()
      .then(done())
      .catch((err) => console.log(err.message));
  });

  afterAll(async (done) => {
    done();
  });
  it('should create new survey', async (done) => {
    const surveyData = {
      title: 'Primeiro Formulário 2',
      coordinator: 1,
      questions: [
        {
          title: 'Você deseja blablabla?',
          questionType: 'MULTIPLE CHOICE',
          choices: ['1', '2'],
        },
      ],
      availableToAnyone: true,
    };
    const response = await request(app).post('/api/surveys').send(surveyData);
    expect(response.body).toMatchObject(surveyData);
    done();
  });
});
