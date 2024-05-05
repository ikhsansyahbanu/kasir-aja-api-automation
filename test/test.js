import request from 'supertest';
import {expect} from 'chai';

const baseUrl = 'https://kasir-api.belajarqa.com/'

describe('API Automation Test', function () {

    let authToken;

    before("Get Token", async () => {
        const loginData = {
            email: 'gmail@isan.com',
            password: 'P@ssw0rd'
        };

        const response = await request(baseUrl)
            .post('authentications')
            .send(loginData)
            .expect(201)
        expect(response.body.data).to.have.property('accessToken')

        authToken = response.body.data.accessToken;
    })

    it('Create User', async () => {
        const createUser = {
            name: "admin",
            email: "example@user.com",
            password: "admin"
        }

        const response = await request(baseUrl)
            .post('users')
            .set('Authorization', `Bearer ${authToken}`)
            .send(createUser)
            .expect(201)

        expect(response.body).to.have.property('status')
        expect(response.body.message).to.eql('User berhasil ditambahkan')
    });

    it('Add Category', async () => {
        const addCategory = {
            name : "makanan ringan",
            description : "makanan ringan"
        }

        const response = await request(baseUrl)
            .post('categories')
            .set('Authorization', `Bearer ${authToken}`)
            .send(addCategory)
            .expect(201)

        expect(response.body.data).to.have.property('name')
        expect(response.body.data.name).to.eql(addCategory.name)
    })
});
