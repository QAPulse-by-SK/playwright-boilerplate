import { faker } from "@faker-js/faker";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Test Data Factory — Dynamic test data generation using Faker.js
 * QA Pulse by SK - www.skakarh.com
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Usage:
 *   import { DataFactory } from "@helpers/dataFactory";
 *
 *   const user    = DataFactory.createUser();
 *   const post    = DataFactory.createPost();
 *   const address = DataFactory.createAddress();
 */

// ─── Interfaces ───────────────────────────────────────────────────────────────
export interface UserData {
  firstName:  string;
  lastName:   string;
  fullName:   string;
  email:      string;
  username:   string;
  password:   string;
  phone:      string;
  avatar:     string;
}

export interface PostData {
  title:  string;
  body:   string;
  userId: number;
  tags:   string[];
}

export interface AddressData {
  street:      string;
  city:        string;
  state:       string;
  country:     string;
  zipCode:     string;
  fullAddress: string;
}

export interface ProductData {
  name:        string;
  description: string;
  price:       number;
  category:    string;
  sku:         string;
}

export interface CardData {
  number:     string;
  cvv:        string;
  expiry:     string;
  cardHolder: string;
}

// ─── Factory ──────────────────────────────────────────────────────────────────
export class DataFactory {

  // ── User ────────────────────────────────────────────────────────────────────
  static createUser(overrides: Partial<UserData> = {}): UserData {
    const firstName = faker.person.firstName();
    const lastName  = faker.person.lastName();
    return {
      firstName,
      lastName,
      fullName:  `${firstName} ${lastName}`,
      email:     faker.internet.email({ firstName, lastName }).toLowerCase(),
      username:  faker.internet.username({ firstName, lastName }).toLowerCase(),
      password:  faker.internet.password({ length: 12, memorable: false }),
      phone:     faker.phone.number(),
      avatar:    faker.image.avatar(),
      ...overrides,
    };
  }

  static createUsers(count: number, overrides: Partial<UserData> = {}): UserData[] {
    return Array.from({ length: count }, () => DataFactory.createUser(overrides));
  }

  // ── Post ────────────────────────────────────────────────────────────────────
  static createPost(overrides: Partial<PostData> = {}): PostData {
    return {
      title:  faker.lorem.sentence(),
      body:   faker.lorem.paragraphs(2),
      userId: faker.number.int({ min: 1, max: 10 }),
      tags:   faker.helpers.arrayElements(
        ["tech", "qa", "automation", "testing", "playwright", "typescript"],
        3
      ),
      ...overrides,
    };
  }

  // ── Address ─────────────────────────────────────────────────────────────────
  static createAddress(overrides: Partial<AddressData> = {}): AddressData {
    const street  = faker.location.streetAddress();
    const city    = faker.location.city();
    const state   = faker.location.state();
    const country = faker.location.country();
    const zipCode = faker.location.zipCode();
    return {
      street,
      city,
      state,
      country,
      zipCode,
      fullAddress: `${street}, ${city}, ${state} ${zipCode}, ${country}`,
      ...overrides,
    };
  }

  // ── Product ─────────────────────────────────────────────────────────────────
  static createProduct(overrides: Partial<ProductData> = {}): ProductData {
    return {
      name:        faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price:       parseFloat(faker.commerce.price({ min: 1, max: 1000 })),
      category:    faker.commerce.department(),
      sku:         faker.string.alphanumeric(8).toUpperCase(),
      ...overrides,
    };
  }

  // ── Credit Card ──────────────────────────────────────────────────────────────
  static createCard(overrides: Partial<CardData> = {}): CardData {
    return {
      number:     faker.finance.creditCardNumber(),
      cvv:        faker.finance.creditCardCVV(),
      expiry:     faker.date.future().toLocaleDateString("en-US", {
        month: "2-digit",
        year:  "2-digit",
      }),
      cardHolder: faker.person.fullName(),
      ...overrides,
    };
  }

  // ── Utility Methods ──────────────────────────────────────────────────────────
  static randomEmail(): string            { return faker.internet.email().toLowerCase(); }
  static randomUsername(): string         { return faker.internet.username().toLowerCase(); }
  static randomPassword(len = 12): string { return faker.internet.password({ length: len }); }
  static randomPhone(): string            { return faker.phone.number(); }
  static randomUrl(): string              { return faker.internet.url(); }
  static randomSentence(): string         { return faker.lorem.sentence(); }
  static randomParagraph(): string        { return faker.lorem.paragraph(); }
  static randomNumber(min = 1, max = 100): number { return faker.number.int({ min, max }); }
  static randomUUID(): string             { return faker.string.uuid(); }
  static randomDate(): Date               { return faker.date.recent(); }
  static randomPastDate(): Date           { return faker.date.past(); }
  static randomFutureDate(): Date         { return faker.date.future(); }
  static randomBoolean(): boolean         { return faker.datatype.boolean(); }
  static randomAlpha(len = 8): string     { return faker.string.alpha(len); }
  static randomAlphaNumeric(len = 8): string { return faker.string.alphanumeric(len); }

  /**
   * Set a fixed seed for reproducible test data
   * Call at start of test: DataFactory.seed(12345)
   */
  static seed(value: number): void {
    faker.seed(value);
  }
}
