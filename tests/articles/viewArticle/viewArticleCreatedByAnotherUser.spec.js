import { test } from '../../_fixtures/fixtures';
import { ViewArticlePage } from '../../../src/ui/pages/article/ViewArticlePage';
import { createArticle } from '../../../src/ui/actions/articles/createArticle';
import { signUpUser } from '../../../src/ui/actions/auth/signUpUser';
import { HomePage } from '../../../src/ui/pages/HomePage';

test.use({ contextsNumber: 3, usersNumber: 3 });

let article1;
let article2;

test.beforeEach(
  async ({ pages, users, articleWithoutTags, articleWithOneTag }) => {
    article1 = articleWithoutTags;
    article2 = articleWithOneTag;

    await signUpUser(pages[0], users[0], 1);
    await signUpUser(pages[1], users[1], 2);
    await signUpUser(pages[2], users[2], 3);
    await createArticle(pages[0], article1, 1);
    await createArticle(pages[1], article2, 1);
  },
);

test('View an article created by another user', async ({
  articleWithoutTags,
  pages,
  users,
}) => {
  const viewArticlePage = new ViewArticlePage(pages[1], 2);

  await viewArticlePage.open(articleWithoutTags.url);

  await viewArticlePage.assertArticleTitleIsVisible(articleWithoutTags.title);
  await viewArticlePage.assertArticleTextIsVisible(articleWithoutTags.text);
  await viewArticlePage.assertArticleAuthorNameIsVisible(users[0].username);
});

test('User can see articles from two followed users in Your Feed', async ({
  articleWithoutTags,
  pages,
  users,
}) => {
  const viewArticlePage = new ViewArticlePage(pages[2], 3);

  //User1
  await viewArticlePage.open(article1.url);

  await viewArticlePage.assertArticleTitleIsVisible(article1.title);
  await viewArticlePage.assertArticleAuthorNameIsVisible(users[0].username);
  await viewArticlePage.clickFollow();
  await viewArticlePage.assertUserFollowed();

  //User2
  await viewArticlePage.open(article2.url);

  await viewArticlePage.assertArticleTitleIsVisible(article2.title);
  await viewArticlePage.assertArticleAuthorNameIsVisible(users[1].username);
  await viewArticlePage.clickFollow();
  await viewArticlePage.assertUserFollowed();

  const homePage = new HomePage(pages[2]);

  await homePage.open();
  await homePage.clickYourFeedTab();
  //User1
  await homePage.asserArticleIsVisible(article1.title);
  await homePage.assertArticleAuthorNameIsVisible(users[0].username);
  //User2
  await homePage.asserArticleIsVisible(article2.title);
  await homePage.assertArticleAuthorNameIsVisible(users[1].username);
});
