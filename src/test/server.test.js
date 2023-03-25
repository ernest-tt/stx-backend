process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
const { describe } = require('node:test');
let should = chai.should();

chai.use(chaiHttp);

describe("/POST trader", () => {
    xit("should register user", (done) => {
        let body = {
            fullName: "Joey",
            email: "jbcd@ab.com",
            password: "password"
        }
        chai.request("http://localhost:5000")
            .post('/trader/register')
            .send(body)
            .end((err, res) => {
                  res.should.have.status(201);
                  res.body.should.be.a('object')
              done();
            });
    })

    it("should login user with correct credentials", (done) => {
        let body = {
            email: "jbcd@ab.com",
            password: "password"
        }
        chai.request("http://localhost:5000")
        .post('/trader/login')
        .send(body)
        .end((err, res) => {
              res.should.have.status(200);
          done();
        });
    })

    it("should not login user with wrong credentials", (done) => {
        let body = {
            email: "jbcd@ab.com",
            password: "passwd"
        }
        chai.request("http://localhost:5000")
        .post('/trader/login')
        .send(body)
        .end((err, res) => {
              res.should.have.status(401);
          done();
        });        
    })

    
})