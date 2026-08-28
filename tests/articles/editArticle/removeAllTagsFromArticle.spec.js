import { test } from '../../_fixtures/fixtures';
import { generateNewArticleData } from '../../../src/common/testData/generateNewArticleData';
import { signUpUser } from '../../../src/ui/actions/auth/signUpUser';
import { createArticle } from '../../../src/ui/actions/articles/createArticle';

const testParameters = [
  { tagsNumber: 1, testNameEnding: 'one tag' },
  { tagsNumber: 2, testNameEnding: 'two tags' },
  { tagsNumber: 5, testNameEnding: 'five tags' },
];

let article;

testParameters.forEach(({ tagsNumber, testNameEnding }) => {
  test.describe('Remove tags from the article', () => {
    test.beforeEach(async ({ page, user, logger }) => {
      article = generateNewArticleData(logger, tagsNumber);
      await signUpUser(page, user);
      await createArticle(page, article);
    });

    test(`Remove ${testNameEnding} from the article`, async ({
      page,
      editArticlePage,
      viewArticlePage
    }) => {

      await viewArticlePage.clickEditArticleButton();
      await editArticlePage.removeAllTags();
      await editArticlePage.clickUpdateButton();
      await page.reload();
      await page.waitForTimeout(5000);
      await viewArticlePage.assertTagIsRemoved(article.tags);
    });
  });
});
