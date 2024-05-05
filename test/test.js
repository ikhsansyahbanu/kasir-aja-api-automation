import request from 'supertest';
import {expect} from 'chai';

const baseUrl = 'https://kasir-api.belajarqa.com/'

describe('API Automation Test', function () {

    let authToken;
    let categoryId = '3f56ce2c-a9d5-4d11-b4aa-e61c90518e70';

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

        categoryId = response.body.data.categoryId
    })

    it("Get Category Detail", async () => {
        const response = await request(baseUrl)
            .get(`categories/${categoryId}`)
            .set('Authorization', `Bearer ${authToken}`)

        expect(response.body.data.category).to.have.property('name')
        expect(response.body.status).to.eql('success')
    })

    it("Add Customer", async () => {
        const addCustomer = {
            name: "Budi",
            phone: "081234567890",
            address: "Bandoeng",
            description: "Budi anak Pak Edi"
        }

        const response = await request(baseUrl)
            .post(`customers`)
            .set('Authorization', `Bearer ${authToken}`)
            .send(addCustomer)
            .expect(201)

        expect(response.body.data).to.have.property('name')
        expect(response.body.status).to.eql('success')
    })

    it("Get Customer List", async () => {
        const response = await request(baseUrl)
            .get(`customers`)
            .set('Authorization', `Bearer ${authToken}`)
            .set('q', 'Budi')
            .set('page', 1)
            .expect(200)

        expect(response.body.data).to.have.property('customers').that.is.an('array');
        expect(response.body).to.have.property('status', 'success')

    })
});
