## install
npm i

## pull database
npx prisma db pull

## generate
npx prisma generate

## create .env
DATABASE_URL="mysql://username:password@localhost:3306/library_db"
DATABASE_USER="root"
DATABASE_PASSWORD=""
DATABASE_NAME="library_db"
DATABASE_HOST="localhost"
DATABASE_PORT=3306

## SQL
DROP DATABASE IF EXISTS library_db;

CREATE DATABASE library_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE library_db;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100),
  email VARCHAR(100),
  phone VARCHAR(20),
  role ENUM('admin', 'librarian') NOT NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  lang VARCHAR(10) DEFAULT 'vi',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,

  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,

  failed_attempts INT DEFAULT 0,
  locked_until DATETIME NULL,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_accounts_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

CREATE TABLE readers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reader_code VARCHAR(20) NOT NULL UNIQUE,
  full_name VARCHAR(100) NOT NULL,
  date_of_birth DATE,
  gender ENUM('male', 'female', 'other'),
  email VARCHAR(100),
  phone VARCHAR(20),
  address VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE authors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  bio TEXT
);

CREATE TABLE publishers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  address VARCHAR(255)
);

CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  parent_id INT,

  FOREIGN KEY (parent_id)
    REFERENCES categories(id)
    ON DELETE SET NULL
);

CREATE TABLE books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  isbn VARCHAR(20) UNIQUE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  publish_year INT,
  language VARCHAR(50),
  pages INT,
  publisher_id INT,
  category_id INT,
  stock_quantity INT NOT NULL DEFAULT 0 COMMENT 'Số sách tồn kho',
  borrowed_quantity INT NOT NULL DEFAULT 0 COMMENT 'Số sách đang cho mượn',
  reserved_quantity INT NOT NULL DEFAULT 0 COMMENT 'Số sách đang giữ chỗ',
  available_quantity INT NOT NULL DEFAULT 0 COMMENT 'Số sách có thể cho mượn,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (publisher_id)
    REFERENCES publishers(id)
    ON DELETE SET NULL,

  FOREIGN KEY (category_id)
    REFERENCES categories(id)
    ON DELETE SET NULL
);

CREATE TABLE book_authors (
  book_id INT NOT NULL,
  author_id INT NOT NULL,

  PRIMARY KEY (book_id, author_id),

  FOREIGN KEY (book_id)
    REFERENCES books(id)
    ON DELETE CASCADE,

  FOREIGN KEY (author_id)
    REFERENCES authors(id)
    ON DELETE CASCADE
);

CREATE TABLE book_copies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  book_id INT NOT NULL,
  copy_code VARCHAR(50) NOT NULL UNIQUE,

  status ENUM('available', 'borrowed', 'lost', 'damaged')
    DEFAULT 'available',

  location VARCHAR(100),

  FOREIGN KEY (book_id)
    REFERENCES books(id)
    ON DELETE CASCADE
);

CREATE TABLE borrow_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reader_id INT NOT NULL,

  borrow_date DATE NOT NULL,
  due_date DATE NOT NULL,
  return_date DATE,

  status ENUM('borrowing', 'returned', 'overdue')
    DEFAULT 'borrowing',

  FOREIGN KEY (reader_id)
    REFERENCES readers(id)
    ON DELETE CASCADE
);

CREATE TABLE borrow_details (
  borrow_id INT NOT NULL,
  book_copy_id INT NOT NULL,

  PRIMARY KEY (borrow_id, book_copy_id),

  FOREIGN KEY (borrow_id)
    REFERENCES borrow_records(id)
    ON DELETE CASCADE,

  FOREIGN KEY (book_copy_id)
    REFERENCES book_copies(id)
    ON DELETE CASCADE
);

CREATE TABLE fines (
  id INT AUTO_INCREMENT PRIMARY KEY,
  borrow_id INT NOT NULL,

  amount DECIMAL(10,2) NOT NULL,
  reason VARCHAR(255),
  paid BOOLEAN DEFAULT FALSE,

  FOREIGN KEY (borrow_id)
    REFERENCES borrow_records(id)
    ON DELETE CASCADE
);

INSERT INTO users (full_name, email, phone, role, status, lang) VALUES
('Admin System', 'admin@library.com', '0900000001', 'admin', 'active', 'vi'),
('Nguyễn Văn A', 'a@library.com', '0900000002', 'librarian', 'active', 'vi'),
('Trần Văn B', 'b@library.com', '0900000003', 'librarian', 'active', 'vi'),
('Lê Thị C', 'c@library.com', '0900000004', 'librarian', 'inactive', 'vi'),
('Phạm Văn D', 'd@library.com', '0900000005', 'librarian', 'active', 'en');

INSERT INTO accounts (user_id, username, password, failed_attempts, locked_until) VALUES
(1, 'admin', '$2b$10$NX0cvR3y7xox8.Y39FarmuVnKHIhhiRUKOW4ayK2WoTlUGuV2yx.C', 0, NULL),
(2, 'librarian1', '$2b$10$NX0cvR3y7xox8.Y39FarmuVnKHIhhiRUKOW4ayK2WoTlUGuV2yx.C', 0, NULL),
(3, 'librarian2', '$2b$10$NX0cvR3y7xox8.Y39FarmuVnKHIhhiRUKOW4ayK2WoTlUGuV2yx.C', 1, NULL),
(4, 'librarian3', '$2b$10$NX0cvR3y7xox8.Y39FarmuVnKHIhhiRUKOW4ayK2WoTlUGuV2yx.C', 5, '2026-02-10 10:00:00'),
(5, 'librarian4', '$2b$10$NX0cvR3y7xox8.Y39FarmuVnKHIhhiRUKOW4ayK2WoTlUGuV2yx.C', 0, NULL);

INSERT INTO readers (reader_code, full_name, date_of_birth, gender, email, phone, address) VALUES
('SV001', 'Nguyễn Văn An', '2002-01-10', 'male', 'an@gmail.com', '0910000001', 'Hà Nội'),
('SV002', 'Trần Thị Bình', '2003-02-15', 'female', 'binh@gmail.com', '0910000002', 'Hải Phòng'),
('SV003', 'Lê Văn Cường', '2001-03-20', 'male', 'cuong@gmail.com', '0910000003', 'Đà Nẵng'),
('SV004', 'Phạm Thị Dung', '2002-04-25', 'female', 'dung@gmail.com', '0910000004', 'Huế'),
('SV005', 'Hoàng Văn Em', '2003-05-30', 'male', 'em@gmail.com', '0910000005', 'TP.HCM');

INSERT INTO authors (name, bio) VALUES
('Robert C. Martin', 'Clean Code author'),
('Martin Fowler', 'Software architect'),
('Joshua Bloch', 'Effective Java author'),
('Nguyễn Nhật Ánh', 'Nhà văn Việt Nam'),
('Paulo Coelho', 'Brazilian novelist');

INSERT INTO publishers (name, address) VALUES
('NXB Trẻ', 'TP.HCM'),
('NXB Giáo Dục', 'Hà Nội'),
('O’Reilly Media', 'USA'),
('Pearson', 'UK'),
('NXB Kim Đồng', 'Hà Nội');

INSERT INTO categories (name, parent_id) VALUES
('Công nghệ thông tin', NULL),
('Văn học', NULL),
('Khoa học', NULL),
('Lập trình', 1),
('Tiểu thuyết', 2);

INSERT INTO books (isbn, title, description, publish_year, language, pages, publisher_id, category_id) VALUES
('9780132350884', 'Clean Code', 'Agile Software', 2008, 'English', 464, 3, 4),
('9780321127426', 'Refactoring', 'Improve Code', 1999, 'English', 448, 4, 4),
('9780134685991', 'Effective Java', 'Java Best Practices', 2018, 'English', 416, 4, 4),
('9786042081234', 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh', 'Tiểu thuyết', 2010, 'Vietnamese', 378, 1, 5),
('9780061122415', 'The Alchemist', 'Novel', 1988, 'English', 208, 5, 5);

INSERT INTO book_authors VALUES
(1,1),(2,2),(3,3),(4,4),(5,5);

INSERT INTO book_copies (book_id, copy_code, status, location) VALUES
(1,'CC-001','available','Kệ A1'),
(1,'CC-002','borrowed','Kệ A1'),
(2,'RF-001','available','Kệ A2'),
(3,'EJ-001','available','Kệ A3'),
(4,'HH-001','available','Kệ B1');

INSERT INTO borrow_records (reader_id, borrow_date, due_date, return_date, status) VALUES
(1,'2026-02-01','2026-02-10',NULL,'borrowing'),
(2,'2026-01-05','2026-01-15','2026-01-14','returned'),
(3,'2026-01-10','2026-01-20',NULL,'overdue'),
(4,'2026-02-02','2026-02-12',NULL,'borrowing'),
(5,'2026-01-01','2026-01-10','2026-01-09','returned');

INSERT INTO borrow_details VALUES
(1,2),(2,1),(3,3),(4,4),(5,5);

INSERT INTO fines (borrow_id, amount, reason, paid) VALUES
(1,50000,'Trễ hạn',FALSE),
(2,0,'Không phạt',TRUE),
(3,100000,'Mất sách',FALSE),
(4,30000,'Hư hỏng',TRUE),
(5,0,'Không phạt',TRUE);