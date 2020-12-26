import { NextFunction } from 'express';
import mongoose from 'mongoose';
import request from 'supertest';

import config from '@config/config';
import { QuestionType } from '@interfaces/survey';
import Survey from '@models/survey';

import app from '../app';

jest.mock('@middlewares/authMiddleware', () => jest.fn((req, res, next: NextFunction) => next()));

describe('Test survey endpoint', () => {
  let correctSurvey;
  let incorrectSurvey;
  beforeEach(async (done) => {
    correctSurvey = {
      title: 'Primeiro Formulário 2',
      coordinator: 1,
      questions: [
        {
          title: 'Você deseja blablabla?',
          questionType: QuestionType.MULTIPLE_CHOICE,
          choices: ['1', '2'],
        },
      ],
      availableToAnyone: true,
    };
    mongoose
      .connect(config.mongo.uri, config.mongo.options)
      .then(done())
      .catch((err) => console.log(err.message));
  });
  afterEach(async (done) => {
    await Survey.deleteMany({}).exec();
    await mongoose.connection.close();
    done();
  });
  afterAll(async (done) => {
    await mongoose.connection.close();
    done();
  });

  it('should return status code 201 on create survey', async (done) => {
    const response = await request(app).post('/api/surveys').send(correctSurvey);
    expect(response.status).toBe(201);
    done();
  });
  it('should create new survey', async (done) => {
    const response = await request(app).post('/api/surveys').send(correctSurvey);
    expect(response.body).toMatchObject(correctSurvey);
    done();
  });
  it('should return status code 204 on delete survey', async (done) => {
    const id = mongoose.Types.ObjectId();
    const survey = new Survey({
      _id: id,
      ...correctSurvey,
    });
    survey
      .save()
      .then(() => {
        request(app)
          .delete(`/api/surveys/${id.toHexString().toString()}`)
          .then((res) => {
            expect(res.status).toBe(204);
            done();
          });
      })
      .catch((err) => console.log(err));
  });
  it('should delete new survey', async (done) => {
    const id = new mongoose.Types.ObjectId();
    const survey = new Survey({
      _id: id,
      ...correctSurvey,
    });
    survey
      .save()
      .then(() => {
        request(app)
          .delete(`/api/surveys/${id.toHexString().toString()}`)
          .then(async (res) => {
            expect(res.body).toMatchObject({});
            const deletedSurvey = await Survey.findById(id).exec();
            expect(deletedSurvey).toBeFalsy();
            done();
          });
      })
      .catch((err) => console.log(err));
  });

  describe('shouldnt create survey with invalid props', () => {
    it('shouldnt allow missing coordinator', async (done) => {
      incorrectSurvey = correctSurvey;
      delete incorrectSurvey.coordinator;
      const response = await request(app).post('/api/surveys').send(incorrectSurvey);
      expect(response.status).toBe(400);
      done();
    });
    it('shouldnt allow missing avaible proprety', async (done) => {
      incorrectSurvey = correctSurvey;
      delete incorrectSurvey.availableToAnyone;
      const response = await request(app).post('/api/surveys').send(incorrectSurvey);
      expect(response.status).toBe(400);
      done();
    });
    it('shouldnt allow missing questions', async (done) => {
      incorrectSurvey = correctSurvey;
      delete incorrectSurvey.questions;
      const response = await request(app).post('/api/surveys').send(incorrectSurvey);
      expect(response.status).toBe(400);
      done();
    });
    it('shouldnt allow missing title', async (done) => {
      incorrectSurvey = correctSurvey;
      delete incorrectSurvey.title;
      const response = await request(app).post('/api/surveys').send(incorrectSurvey);
      expect(response.status).toBe(400);
      done();
    });
    it('shouldnt allow empty questions', async (done) => {
      incorrectSurvey = correctSurvey;
      incorrectSurvey.questions = [];
      const response = await request(app).post('/api/surveys').send(incorrectSurvey);
      expect(response.status).toBe(400);
      done();
    });
    it('avaibleToAnyone prop should be an boolean', async (done) => {
      incorrectSurvey = correctSurvey;
      incorrectSurvey.availableToAnyone = 1;
      const response = await request(app).post('/api/surveys').send(incorrectSurvey);
      expect(response.status).toBe(400);
      done();
    });
    it('question should have title', async (done) => {
      delete correctSurvey.questions[0].title;
      incorrectSurvey = correctSurvey;
      const response = await request(app).post('/api/surveys').send(incorrectSurvey);
      expect(response.status).toBe(400);
      done();
    });
    it('question should have questionType', async (done) => {
      delete correctSurvey.questions[0].questionType;
      incorrectSurvey = correctSurvey;
      const response = await request(app).post('/api/surveys').send(incorrectSurvey);
      expect(response.status).toBe(400);
      done();
    });
    it('question should have valid questionType', async (done) => {
      correctSurvey.questions[0].questionType = 'TEST';
      incorrectSurvey = correctSurvey;
      const response = await request(app).post('/api/surveys').send(incorrectSurvey);
      expect(response.status).toBe(400);
      done();
    });
    it('shouldnt allow choices when openText', async (done) => {
      correctSurvey.questions[0].questionType = QuestionType.OPEN_TEXT;
      incorrectSurvey = correctSurvey;
      incorrectSurvey.choices = ['1', '2'];
      const response = await request(app).post('/api/surveys').send(incorrectSurvey);
      expect(response.status).toBe(400);
      done();
    });
    it('shouldnt allow choices when YesNo', async (done) => {
      correctSurvey.questions[0].questionType = QuestionType.YES_NO;
      incorrectSurvey = correctSurvey;
      incorrectSurvey.choices = ['1', '2'];
      const response = await request(app).post('/api/surveys').send(incorrectSurvey);
      expect(response.status).toBe(400);
      done();
    });
    it('shouldnt allow choices when YesNo', async (done) => {
      correctSurvey.questions[0].questionType = QuestionType.YES_NO;
      incorrectSurvey = correctSurvey;
      incorrectSurvey.choices = ['1', '2'];
      const response = await request(app).post('/api/surveys').send(incorrectSurvey);
      expect(response.status).toBe(400);
      done();
    });
    it('should allow invalid choiches', async (done) => {
      correctSurvey.questions[0].questionType = QuestionType.MULTIPLE_CHOICE;
      incorrectSurvey = correctSurvey;
      incorrectSurvey.choices = ['1'];
      let response = await request(app).post('/api/surveys').send(incorrectSurvey);
      expect(response.status).toBe(400);
      incorrectSurvey.choices = ['1', true];
      response = await request(app).post('/api/surveys').send(incorrectSurvey);
      expect(response.status).toBe(400);
      done();
    });
  });
});
