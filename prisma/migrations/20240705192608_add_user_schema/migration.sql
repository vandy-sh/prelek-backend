-- CreateTable
CREATE TABLE `users` (
    `user_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `house_number` INTEGER NOT NULL,
    `roles` VARCHAR(191) NOT NULL,
    `phone_number` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,

    INDEX `users_user_id_idx`(`user_id`),
    INDEX `users_name_idx`(`name`),
    INDEX `users_house_number_idx`(`house_number`),
    INDEX `users_phone_number_idx`(`phone_number`),
    INDEX `users_roles_idx`(`roles`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
