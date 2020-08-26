import LocalStrategy from 'passport-local';
import { pool } from './dbConfig.js';
import bcrypt from 'bcrypt';
// import { authenticate } from 'passport';

// LocalStrategy.Strategy

const authenticateUser = (email, password, done) => {
    pool.query(
        `SELECT * FROM users WHERE email = $1`, [email], (err, results) => {
            if (err) {
                throw err
            } 
            console.log(results.rows)

            if (results.rows > 0) {
                const user = results.rows[0]
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) {
                        throw err
                    }
                    if (isMatch) {
                        return done(null, user)
                    } else {
                        return done(null, false, { message: 'Password is not correct' })
                    }
                })
            } else {
                return done(null, false, { message: 'Email is not registered' });
            }
        }
    )
}

function initialize(passport) {
    passport.use(
        new LocalStrategy.Strategy({
            usernameField:"email",
            passwordField: "password"
        }, authenticateUser)
    )
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        pool.query(
            `SELECT * FROM users WHERE id = $1`, [id], (err, results) => {
                if (err) {
                    throw err
                }
                return done(null, results.rows[0])
            }
        )
    })
}

export default initialize;