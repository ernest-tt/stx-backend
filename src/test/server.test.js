process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
const { describe } = require('node:test');
let should = chai.should();

chai.use(chaiHttp);

describe("Routers Test", () => {
    let agent;
    before((done) => {
        agent = chai.request.agent("http://localhost:5000");
        agent.post('/trader/login')
        .send({email: "jbcd@ab.com", password: "password"})
        .end((err, res) => {
          done();
        });
    })

    xdescribe("trader router", () => {
        it("should register user", (done) => {
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
    
        it("should not register user with already existing email", (done) => {
            let body = {
                fullName: "Joey",
                email: "jbcd@ab.com",
                password: "password"
            }
            chai.request("http://localhost:5000")
                .post('/trader/register')
                .send(body)
                .end((err, res) => {
                      res.should.have.status(500);
    
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

    describe("purchase router", () => {
        it("should create-request", () => {
            let body = {
                offerId: 1,
                providerId: 1,
                amount: 100,
                accountId: 7
            }
            agent.post('/purchase/create-request')
                .send(body)
                .then((res) => {
                    res.should.have.status(201)
                    res.body.should.be.a('string')
                })
        })

        it("should get all requests", () => {
            agent.get('/purchase/all')
                .then((res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('array')
                })
        })
    })

    describe("account router", () => {
        it("should get all user bank accounts", () => {
            agent.get('/accounts/banks')
                .then((res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('array')
                })
        })

        it("should get all banks", () => {
            agent.get('/accounts/banks')
                .then((res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('array')
                })
        })

        it("should get user platform balance", () => {
            agent.get('/accounts/banks')
                .then((res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('array')
                })            
        })

        it("should add a bank account", () => {
            
        })
    })
})