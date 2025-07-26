import { defineStore } from 'pinia';
import { Cookies } from 'quasar';
import { api } from 'boot/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: Cookies.get('token') || null,
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
  },
});
