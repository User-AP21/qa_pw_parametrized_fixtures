import { expect, testStep } from '../../common/pwHelpers/pw';

export class HomePage {
  constructor(page, userId = 0) {
    this.page = page;
    this.userId = userId;
    this.yourFeedTab = page.getByText('Your Feed', { exact: true });
    this.newArticleLink = page.getByRole('link', { name: 'New Article' });
  }

  async step(title, stepToRun) {
    return await testStep(title, stepToRun, this.userId);
  }

  authorLinkInArticleHeader(username) {
    return this.page.getByRole('link', { name: username }).first();
  }

  async clickNewArticleLink() {
    await this.step(`Click the 'New Article' link`, async () => {
      await this.newArticleLink.click();
    });
  }

  async assertYourFeedTabIsVisible() {
    await this.step(`Assert the 'Your Feed' tab is visible`, async () => {
      await expect(this.yourFeedTab).toBeVisible();
    });
  }

  async open() {
    await this.page.goto('/');
  }

  async clickYourFeedTab() {
    await this.yourFeedTab.click();
  }

  async asserArticleIsVisible(title) {
    await expect(
      this.page.getByRole('heading', {
        name: `Article title: ${title}`,
      }),
    ).toBeVisible();
  }

  async assertArticleAuthorNameIsVisible(username) {
    await expect(this.authorLinkInArticleHeader(username)).toBeVisible();
  }
}
