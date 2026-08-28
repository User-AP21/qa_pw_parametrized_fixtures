import { test, expect, testStep } from '../../../common/pwHelpers/pw';

export class ViewArticlePage {
  constructor(page, userId = 0) {
    this.page = page;
    this.userId = userId;
    this.articleTitleHeader = page.getByRole('heading');
    this.editArticleButton = page
      .getByRole('link', { name: ' Edit Article' })
      .nth(1);
    this.updateButton = page.getByRole('button', {
      name: 'Update',
    });
    this.tagList = page.locator('ul.tag-list > li');
    this.followButton = page.getByRole('button', {
      name: /Follow/,
    });
    this.unfollowButton = page.getByRole('button', {
      name: /Unfollow/,
    });
  }

  authorLinkInArticleHeader(username) {
    return this.page.getByRole('link', { username }).first();
  }

  tagListItem(tagName) {
    return this.page.getByRole('listitem').filter({ hasText: tagName });
  }

  async step(title, stepToRun) {
    return await testStep(title, stepToRun, this.userId);
  }

  url() {
    return this.page.url();
  }

  async open(url) {
    await this.page.goto(url);
  }

  async clickEditArticleButton() {
    await this.editArticleButton.click();
  }

  async clickUpdateButton() {
    await this.updateButton.click();
  }

  async clickFollow() {
    await this.followButton.nth(1).click();
  }

  async clickUnfollow() {
    await this.unfollowButton.nth(1).click();
  }

  async assertArticleTitleIsVisible(title) {
    await expect(this.articleTitleHeader).toContainText(title);
  }

  async assertArticleAuthorNameIsVisible(username) {
    await expect(this.authorLinkInArticleHeader(username)).toBeVisible();
  }

  async assertArticleTextIsVisible(text) {
    await expect(this.page.getByText(text)).toBeVisible();
  }

  async assertArticleTagsAreVisible(tags) {
    for (let i = 0; i < tags.length; i++) {
      await expect(this.tagListItem(tags[i])).toBeVisible();
    }
  }

  async assertArticleTagIsVisible(tags) {
    await expect
      .poll(() => this.tagList.allTextContents())
      .toEqual(expect.arrayContaining(tags));
  }

  async assertUserFollowed() {
    await expect(this.unfollowButton.nth(1)).toBeVisible();
  }

  async assertUserUnfollowed() {
    await expect(this.followButton.nth(1)).toBeVisible();
  }

  async assertTagIsRemoved(tag) {
    await expect(
      this.tagList.locator('span.tag-pill').filter({ hasText: tag }),
    ).toHaveCount(0);
  }
}
