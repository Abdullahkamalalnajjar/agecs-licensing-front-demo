import { http, HttpResponse } from 'msw';
import { mockAuthUser, mockAuthStudent, mockProducts, mockLicenses, mockTicketCategories, mockTickets, mockPromocodes } from './mockData';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:5003';

export const handlers = [
  // Auth
  http.get(`${BASE_URL}/identity/users`, () => {
    return HttpResponse.json({
      value: [mockAuthUser, mockAuthStudent],
      isSuccess: true,
      isError: false,
      errors: []
    });
  }),
  http.get(`${BASE_URL}/identity/current-user`, () => {
    return HttpResponse.json({
      value: mockAuthUser,
      isSuccess: true,
      isError: false,
      errors: []
    });
  }),
  http.post(`${BASE_URL}/identity/token/generate`, () => {
    return HttpResponse.json({
      value: { accessToken: "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJtb2NrLXVzZXItMTIzIiwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGUiOiJBZG1pbiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIn0.", refreshToken: "mock-refresh-token", expiresOnUtc: "2099-01-01T00:00:00Z" },
      isSuccess: true,
      isError: false,
      errors: []
    });
  }),
  http.post(`${BASE_URL}/identity/token/google`, () => {
    return HttpResponse.json({
      value: { accessToken: "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJtb2NrLXVzZXItMTIzIiwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsInJvbGUiOiJBZG1pbiIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IkFkbWluIn0.", refreshToken: "mock-refresh-token", expiresOnUtc: "2099-01-01T00:00:00Z" },
      isSuccess: true,
      isError: false,
      errors: []
    });
  }),
  
  // Products
  http.get(`${BASE_URL}/api/products`, () => {
    return HttpResponse.json({
      value: mockProducts,
      isSuccess: true,
      isError: false,
      errors: []
    });
  }),
  http.get(`${BASE_URL}/api/products/:id`, ({ params }) => {
    const product = mockProducts.find(p => p.id === params.id) || mockProducts[0];
    return HttpResponse.json({
      value: product,
      isSuccess: true,
      isError: false,
      errors: []
    });
  }),
  http.get(`${BASE_URL}/api/products/:id/versions`, () => {
    return HttpResponse.json({
      value: [
        {
          id: "v1",
          versionNumber: "1.0.0",
          releaseNotes: "Initial version",
          fileSizeBytes: 1520485,
          isActive: true,
          createdAtUtc: new Date().toISOString(),
          filePath: "/mock-file-path.zip"
        }
      ],
      isSuccess: true,
      isError: false,
      errors: []
    });
  }),

  // Licenses
  http.get(`${BASE_URL}/api/licenses`, () => {
    return HttpResponse.json({
      value: mockLicenses,
      isSuccess: true,
      isError: false,
      errors: []
    });
  }),

  // Tickets
  http.get(`${BASE_URL}/api/ticket-categories`, () => {
    return HttpResponse.json({
      value: mockTicketCategories,
      isSuccess: true,
      isError: false,
      errors: []
    });
  }),
  http.get(`${BASE_URL}/api/tickets`, () => {
    return HttpResponse.json({
      value: mockTickets,
      isSuccess: true,
      isError: false,
      errors: []
    });
  }),
  http.get(`${BASE_URL}/api/tickets/:id`, ({ params }) => {
    const ticket = mockTickets.find(t => t.id === params.id) || mockTickets[0];
    return HttpResponse.json({
      value: ticket,
      isSuccess: true,
      isError: false,
      errors: []
    });
  }),
  
  // Promocodes
  http.get(`${BASE_URL}/api/promocodes`, () => {
    return HttpResponse.json({
      value: mockPromocodes,
      isSuccess: true,
      isError: false,
      errors: []
    });
  }),
  
  // Fallback for everything else
  http.all(`${BASE_URL}/*`, () => {
    return HttpResponse.json({
      isSuccess: true,
      value: {},
      isError: false,
      errors: []
    });
  })
];
