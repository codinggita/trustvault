import { rest } from 'msw'

export const handlers = [
  // Login endpoint
  rest.post('/api/auth/login', (req, res, ctx) => {
    const { email, password } = req.body

    // Simulate validation
    if (!email || !password) {
      return res(
        ctx.status(400),
        ctx.json({
          message: 'Email and password are required'
        })
      )
    }

    // Simulate invalid credentials
    if (email !== 'user@example.com' || password !== 'password123') {
      return res(
        ctx.status(401),
        ctx.json({
          message: 'Invalid email or password'
        })
      )
    }

    // Simulate successful login
    return res(
      ctx.status(200),
      ctx.json({
        token: 'fake-jwt-token',
        user: {
          id: 1,
          email: 'user@example.com',
          firstName: 'John',
          lastName: 'Doe'
        }
      })
    )
  }),

  // Register endpoint
  rest.post('/api/auth/register', (req, res, ctx) => {
    const { email, password, firstName, lastName } = req.body

    // Simulate validation
    if (!email || !password || !firstName || !lastName) {
      return res(
        ctx.status(400),
        ctx.json({
          message: 'All fields are required'
        })
      )
    }

    // Simulate email already exists
    if (email === 'existing@example.com') {
      return res(
        ctx.status(409),
        ctx.json({
          message: 'User with this email already exists'
        })
      )
    }

    // Simulate weak password
    if (password.length < 8) {
      return res(
        ctx.status(400),
        ctx.json({
          message: 'Password must be at least 8 characters'
        })
      )
    }

    // Simulate successful registration
    return res(
      ctx.status(201),
      ctx.json({
        token: 'fake-jwt-token',
        user: {
          id: 2,
          email,
          firstName,
          lastName
        }
      })
    )
  }),

  // Logout endpoint
  rest.post('/api/auth/logout', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        message: 'Logged out successfully'
      })
    )
  }),

  // Get current user endpoint
  rest.get('/api/auth/me', (req, res, ctx) => {
    const token = req.headers.get('authorization')?.split(' ')[1]

    if (!token) {
      return res(
        ctx.status(401),
        ctx.json({
          message: 'No token provided'
        })
      )
    }

    // Simulate invalid token
    if (token !== 'fake-jwt-token') {
      return res(
        ctx.status(401),
        ctx.json({
          message: 'Invalid token'
        })
      )
    }

    // Simulate successful user retrieval
    return res(
      ctx.status(200),
      ctx.json({
        id: 1,
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe'
      })
    )
  })
]