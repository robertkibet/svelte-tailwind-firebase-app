import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.goto('http://localhost:4173');
	await page.waitForLoadState('domcontentloaded');

	// page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
});

test('Page loads title', async ({ page }) => {
	await page.goto('/');

	expect(await page.title()).toContain('Svelte Todo App');
});

test('Should have nav with 2 links', async ({ page }) => {
	await page.goto('/');
	const nav = page.locator('nav');

	expect(await nav.isVisible()).toBe(true);

	const navLinks = nav.locator('a');

	expect(await navLinks.count()).toBe(2);
});

test('Nav should have index page and about page links', async ({ page }) => {
	await page.goto('/');
	const nav = page.locator('nav');

	const navLinks = nav.locator('a');
	const homePage = await navLinks.nth(0).getAttribute('href');
	const aboutPage = await navLinks.nth(1).getAttribute('href');

	expect(homePage).toBe('/');
	expect(aboutPage).toBe('/about');
});

test('Homepage should have input field with add todo button', async ({ page }) => {
	await page.goto('/');

	await page.waitForTimeout(1000);

	const input = await page.locator('[data-todos="todo-input"]');
	const button = await page.locator('[data-todos="add-todo"]');

	await page.waitForTimeout(1000);

	expect(await input.isVisible()).toBe(true);
	expect(await button.isVisible()).toBe(true);

	const inputType = await input.getAttribute('type');
	expect(inputType).toBe('text');

	const buttonText = await button.innerText();
	expect(buttonText.toLowerCase().trim()).toBe('add todo'.trim());
});

test('Should add todo to list', async ({ page }) => {
	await page.goto('/');

	await page.waitForTimeout(1000);

	const input = await page.locator('[data-todos="todo-input"]');
	const button = await page.locator('[data-todos="add-todo"]');

	await page.waitForTimeout(1000);

	const todoList = page.locator('[data-todos="todos"]');
	const todoItems = await todoList.locator('[data-todos="todo-item"]');

	const todoListLength = await todoItems.count();

	const randomId = await page.evaluate(() => crypto.randomUUID());

	await input.fill(`Test ${randomId}`);
	await button.click();

	await page.waitForTimeout(1000);

	const todoItemsUpdated = await todoList.locator('[data-todos="todo-item"]');
	const todoListLengthUpdated = await todoItemsUpdated.count();

	expect(todoListLength).toBeGreaterThan(0);

	expect(todoListLengthUpdated).toBeGreaterThan(todoListLength);
});
