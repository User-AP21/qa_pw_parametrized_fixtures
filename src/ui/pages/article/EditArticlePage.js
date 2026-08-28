import { test, expect, testStep } from '../../../common/pwHelpers/pw';

export class EditArticlePage {
  constructor(page, userId = 0) {
    this.page = page;
    this.userId = userId;
    this.articleTitleHeader = page.getByRole('heading');
    this.tagsField = page.getByPlaceholder('Enter tags');
    this.updateButton = page.getByRole('button', { name: 'Update Article' });
    this.removeTagButtons = page.locator('div.tag-list i.ion-close-round');
  }

  async step(title, stepToRun) {
    return await testStep(title, stepToRun, this.userId);
  }

  async fillTagsField(tags) {
    for (const tag of tags) {
      await this.tagsField.fill(tag);
      await this.tagsField.press('Enter');
    }
  }

  async clickUpdateButton() {
    await this.updateButton.click();
  }

  async removeAllTags() {
    while ((await this.removeTagButtons.count()) > 0) {
      await this.removeTagButtons.first().click();
    }
  }

  async assertArticleTitle(title) {
    await this.step(`Assert the article has correct title'`, async () => {
      await expect(this.articleTitleHeader).toContainText(title);
    });
  }

  async assertArticleText(text) {
    await this.step(`Assert the article has correct text'`, async () => {
      await expect(this.page.getByText(text)).toBeVisible();
    });
  }
}
