import { test, expect } from '@playwright/test';
import { request } from 'https';

let authtoken: string;
let testName: string = 'New Test Article ' + Math.floor(Math.random() * 1000);
test.beforeAll('beforeAll hook', async ({ request }) => {

  const dataOutput = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: {
      user: {
        email: 'rupadevi.aila@gmail.com',
        password: 'Cypress@gmail1'
      }
    }
  })

  const tokenResponse = await dataOutput.json()
  authtoken = 'Token ' + tokenResponse.user.token;


});

test.afterAll('afterAll hook', async ({ request }) => {
  console.log('afterAll hook executed');
});

test('Get tags', async ({ request }) => {

  const dataOutput = await request.get('https://conduit-api.bondaracademy.com/api/tags').then((response) => {
    expect(response.status()).toBe(200);
    return response;

  });
  const data = await dataOutput.json();
  console.log(data);


});

test('Get Atricles', async ({ request }) => {


  const dataOutput = await request.get('https://conduit-api.bondaracademy.com/api/articles').then((response) => {
    expect(response.status()).toBe(200);
    return response;

  });
  const data = await dataOutput.json();
  console.log(data.articles[0].title);

});

test('Create and Delete Article', async ({ request }) => {


  const newResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles', {
    headers: {
      Authorization: authtoken
    },
    data: {
      article: {
        title: 'New Article',
        description: 'This is a new article',
        body: 'This is the body of the new article',
        tagList: ['test', 'playwright']
      }
    }
  })
  const newArticle = await newResponse.json();
  console.log(newArticle);

  expect(newResponse.status()).toEqual(201);
  expect(newArticle.article.title).toBe('New Article');
  expect(newArticle.article.description).toBe('This is a new article');
  expect(newArticle.article.body).toContain('This is the body of the new article');
  // expect(newArticle.article.tagList).toEqual(['test', 'playwright']);

  const slugID = newArticle.article.slug;

  const deleteResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugID}`, {
    headers: {
      Authorization: authtoken
    }
  })
});

test('Create and modify and delete Article', async ({ request }) => {


  const newResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles', {
    headers: {
      Authorization: authtoken
    },
    data: {
      article: {
        title: 'New Article1',
        description: 'This is a new article1',
        body: 'This is the body of the new article',
        tagList: ['test', 'playwright']
      }
    }
  })
  const newArticle = await newResponse.json();
  console.log(newArticle);

  expect(newResponse.status()).toEqual(201);
  expect(newArticle.article.title).toBe('New Article1');
  expect(newArticle.article.description).toBe('This is a new article1');
  expect(newArticle.article.body).toContain('This is the body of the new article');
  // expect(newArticle.article.tagList).toEqual(['test', 'playwright']);

  const slugID = newArticle.article.slug;

  const updateResponse = await request.put(`https://conduit-api.bondaracademy.com/api/articles/${slugID}`, {
    headers: {
      Authorization: authtoken
    },
    data: {
      article: {
        title: 'Updated Article',
        description: 'This is an updated article',
        body: 'This is the body of the updated article',
        tagList: ['updated', 'playwright']
      }
    }
  })

  const updatedArticle = await updateResponse.json();
  console.log(updatedArticle);

  expect(updateResponse.status()).toEqual(200);
  expect(updatedArticle.article.title).toBe('Updated Article');
  expect(updatedArticle.article.description).toBe('This is an updated article');
  expect(updatedArticle.article.body).toContain('This is the body of the updated article');

  const slugID1 = updatedArticle.article.slug;
  const deleteResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugID1}`, {
    headers: {
      Authorization: authtoken
    }
  })
});
test('create Unique Article', async ({ request }) => {

  const newResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles', {
    headers: {
      Authorization: authtoken
    },
    data: {
      article: {
        title: testName,
        description: 'This is a unique article',
        body: 'This is the body of the unique article',
        tagList: ['unique', 'playwright']
      }
    }
  })
  const newArticle = await newResponse.json();
  console.log(newArticle);

  expect(newResponse.status()).toEqual(201);
  expect(newArticle.article.title).toBe(testName);
  expect(newArticle.article.description).toBe('This is a unique article');
  expect(newArticle.article.body).toContain('This is the body of the unique article');
  expect(newArticle.article.tagList).toContain('unique');



});
