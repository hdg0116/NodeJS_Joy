-- CreateTable
CREATE TABLE `user` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(40) NOT NULL,
    `nickname` VARCHAR(60) NULL,
    `gender` ENUM('man', 'woman') NULL,
    `birth` DATE NULL,
    `address` VARCHAR(100) NULL,
    `detail_address` VARCHAR(255) NULL,
    `phone_num` VARCHAR(60) NULL,
    `email` VARCHAR(60) NOT NULL,
    `password` VARCHAR(200) NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `status` ENUM('active', 'withdraw') NOT NULL,
    `phone_verified` BOOLEAN NULL DEFAULT false,
    `current_point` INTEGER NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_preference` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `food_id` BIGINT NOT NULL,

    INDEX `user_id`(`user_id`),
    INDEX `food_id`(`food_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `food` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_point` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `amount` INTEGER NOT NULL,
    `reason` VARCHAR(100) NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mission` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(30) NOT NULL,
    `description` TEXT NOT NULL,
    `store_id` BIGINT NOT NULL,
    `status` ENUM('active', 'withdraw') NOT NULL,
    `point` BIGINT NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `preference-option` (
    `id` BIGINT NOT NULL,
    `question` TEXT NOT NULL,
    `option` VARCHAR(50) NOT NULL,
    `option_type` ENUM('single', 'multiple') NOT NULL,
    `is_active` BOOLEAN NOT NULL,
    `created_at` DATETIME(6) NOT NULL,
    `updated_at` DATETIME(6) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `region` (
    `id` BIGINT NOT NULL,
    `region` VARCHAR(50) NOT NULL,
    `status` ENUM('active', 'withdraw') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `review` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `store_id` BIGINT NULL,
    `title` VARCHAR(70) NULL,
    `detail` TEXT NULL,
    `rating` FLOAT NULL,
    `status` ENUM('active', 'withdraw') NOT NULL,
    `user_mission_id` BIGINT NULL,
    `user_id` BIGINT NOT NULL,
    `mission_id` BIGINT NULL,
    `created_at` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `fk_review_store`(`store_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `store` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `store` VARCHAR(50) NOT NULL,
    `address` VARCHAR(200) NOT NULL,
    `description` TEXT NULL,
    `region_id` BIGINT NOT NULL,
    `status` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user-mission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `mission_id` BIGINT NOT NULL,
    `status` ENUM('IN_PROGRESS', 'COMPLETED', 'FAILED') NULL DEFAULT 'IN_PROGRESS',
    `started_at` DATETIME(6) NULL,
    `completed_at` DATETIME(6) NULL,

    INDEX `FK_mission_TO_user-mission_1`(`mission_id`),
    INDEX `FK_user_TO_user-mission_1`(`user_id`),
    PRIMARY KEY (`id`, `user_id`, `mission_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user-preference` (
    `id` BIGINT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `option_id` BIGINT NOT NULL,
    `created_at` DATETIME(6) NOT NULL,
    `updated_at` DATETIME(6) NOT NULL,
    `status` ENUM('active', 'withdraw') NOT NULL,

    INDEX `FK_preference-option_TO_user-preference_1`(`option_id`),
    INDEX `FK_user_TO_user-preference_1`(`user_id`),
    PRIMARY KEY (`id`, `user_id`, `option_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_preference` ADD CONSTRAINT `user_preference_ibfk_2` FOREIGN KEY (`food_id`) REFERENCES `food`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user_point` ADD CONSTRAINT `user_point_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `review` ADD CONSTRAINT `fk_review_store` FOREIGN KEY (`store_id`) REFERENCES `store`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user-preference` ADD CONSTRAINT `FK_preference-option_TO_user-preference_1` FOREIGN KEY (`option_id`) REFERENCES `preference-option`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user-preference` ADD CONSTRAINT `FK_회원 정보_TO_user-preference_1` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
