const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');
const mongoose = require('mongoose');
let server;

describe('/api/genres', () => {
    beforeEach(() => { server = require('../../app'); });
    afterEach(async () => {
        await server.close();
        await Genre.remove({});
    });

    describe('GET /', () => {
        it('should return all genres', async () => {
           await Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' }
            ])
            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return the genre if valid id is passed', async () => {
            const genre = new Genre({ name: 'genre1'});
            await genre.save();
        
            const res = await request(server).get('/api/genres/' + genre._id );

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server).get('/api/genres/1');

            expect(res.status).toBe(404);
        });

        it('should return 404 if no genre with the given id exists', async () => {
            const id = mongoose.Types.ObjectId().toHexString();
            const res = await request(server).get(`/api/genres/${id}`);

            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {

        // Define the happy path, and then in each test, we change one parameter that clearly aligns with the name of the test.
        let token;
        let name;

        const exec = async function () {
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name });
        }

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre1';
        })

        it('should return 401 if client is client is not logged in', async () => {
            token = '';

            const res = await exec();
            
            expect(res.status).toBe(401);
        });

        it('should return 400 if genre is less than 5 characters', async () => {
            name = '1234';

            const res = await exec();
            
            expect(res.status).toBe(400);
        });

        it('should return 400 if genre is less than 50 characters', async () => {

            name = new Array(52).join('a');

           const res = await exec();
            
            expect(res.status).toBe(400);
        });

        it('should save the genre if it is valid', async () => {
            await exec();

            const genre = await Genre.find({ name: 'genre1' });

            expect(genre).not.toBeNull();
        });

        it('should return the genre if it is valid', async () => {

            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });

    describe('PUT /:id', () => {
        let token;
        let name;
        let genre;

        beforeEach(async () => {
            token = new User().generateAuthToken();
            genre = new Genre({ name: 'genre1'});
            await genre.save();
            name = 'newName';
        });

        const exec = async () => {
            return await request(server)
                .put(`/api/genres/${genre._id}`)
                .set('x-auth-token', token)
                .send({ name: name });
        }

        it('should return 400 if a bad request is passed', async () => {
            name = new Array(52).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return 200 and update the document if a valid request is made', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({ name: name });
        });

        it('should return status 404 if the genre could not be found with the give id', async () => {
            genre = new Genre({ name: 'newID'});

            const res = await exec();

            expect(res.status).toBe(404);
        });
    });

    describe('DELETE /:id', () => {
        let token;
        let user;
        let genre;
        
        beforeEach(async () => {
            user = new User({ name: 'user1', isAdmin: true });
            genre = new Genre({ name: 'genre1' });
            await genre.save();
            token = user.generateAuthToken();
        })

        const exec = async () => {
            return await request(server)
                .delete(`/api/genres/${genre._id}`)
                .set('x-auth-token', token)
        }

        it('should return 200 and the genre object that was removed', async () => {
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body).toMatchObject({name: 'genre1'});
        });

        it('should return 404 if the the genre with the given id was not found', async () => {
            genre =  new Genre({ name: 'genre2' });

            res = await exec();

            expect(res.status).toBe(404);
        });
    });
});