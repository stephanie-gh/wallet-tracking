import { defineStore } from 'pinia';
import { Cookies } from 'quasar';
import { api } from 'boot/axios';

export interface Login {
  username: string;
  password: string;
}
export interface Register {
  username: string;
  password: string;
  email: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  name: {
    firstname: string;
    lastname: string;
  };
  phone: string;
  address: {
    geolocation: {
      lat: string;
      long: string;
    };
    city: string;
    street: string;
    number: number;
    zipcode: string;
  };
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: Cookies.get('token') || null,
    user: null as User | null,
  }),
  actions: {
    async login(username: string, password: string) {
      try {
        const res = await api.post('/auth/login', {
          username,
          password,
        });

        const token = res.data.token;
        if (token) {
          this.token = token;
          Cookies.set('token', token, { expires: 7 });
          Cookies.set('user', username, { expires: 7 });

          console.log('User logged in');
        } else {
          throw new Error('Token not received');
        }
      } catch (err) {
        console.error('Login error:', err);
        throw err;
      }
    },
    async register(email: string, username: string, password: string) {
      try {
        const usersRes = await api.get('/users');
        const users = usersRes.data;

        const newId = users.length + 1;

        const res = await api.post('/users', {
          id: newId,
          username,
          email,
          password,
        });

        console.log('User registered:', res.data);
        return res.data;
      } catch (err) {
        console.error('Registration error:', err);
        throw err;
      }
    },
    logout() {
      this.token = null;
      Cookies.remove('token');
    },
    async fetchCurrentUser() {
      if (!this.token) return;

      const username = Cookies.get('user');
      if (!username) return;

      const usersRes = await api.get('/users');
      const foundUser = usersRes.data.find((u: User) => u.username === username);
      this.user = foundUser || null;
    },
  },
});
