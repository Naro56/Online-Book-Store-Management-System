-- Additional books for the bookstore database
-- This script adds a variety of Indian books from different genres and languages

-- First, let's ensure we have all the necessary categories
INSERT IGNORE INTO categories (name) VALUES 
('Fiction'),
('Non-Fiction'),
('Poetry'),
('Mythology'),
('History'),
('Philosophy'),
('Biography'),
('Self-Help'),
('Science'),
('Drama'),
('Short Stories'),
('Classic Literature'),
('Contemporary Fiction'),
('Historical Fiction'),
('Romance'),
('Mystery'),
('Thriller'),
('Fantasy'),
('Science Fiction'),
('Children''s Literature');

-- Hindi Books
INSERT INTO books (title, author, description, price, stock_quantity, isbn, category_id, image_url) VALUES
('Godan', 'Munshi Premchand', 'A classic Hindi novel depicting the life of Indian peasants and their struggles.', 299.00, 15, '9788126415182', (SELECT id FROM categories WHERE name = 'Fiction'), 'https://m.media-amazon.com/images/I/81Ym0oKRMDL._AC_UF1000,1000_QL80_.jpg'),
('Madhushala', 'Harivansh Rai Bachchan', 'A collection of Hindi poems that explore the philosophy of life through the metaphor of wine.', 199.00, 20, '9788126439874', (SELECT id FROM categories WHERE name = 'Poetry'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Raag Darbari', 'Shrilal Shukla', 'A satirical Hindi novel that portrays the rural life and politics in post-independence India.', 249.00, 18, '9788126415199', (SELECT id FROM categories WHERE name = 'Fiction'), 'https://m.media-amazon.com/images/I/81jv44QdNwL._AC_UF1000,1000_QL80_.jpg'),
('Chandrakanta', 'Devaki Nandan Khatri', 'A romantic fantasy novel in Hindi, considered one of the first works of prose in modern Hindi literature.', 349.00, 12, '9788126415205', (SELECT id FROM categories WHERE name = 'Fantasy'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Gunahon Ka Devta', 'Dharamvir Bharati', 'A Hindi novel that explores complex human relationships and societal norms.', 279.00, 15, '9788126415212', (SELECT id FROM categories WHERE name = 'Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Rashmirathi', 'Ramdhari Singh Dinkar', 'An epic Hindi poem based on the Mahabharata, focusing on Karna.', 199.00, 25, '9788126415229', (SELECT id FROM categories WHERE name = 'Poetry'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Mrityunjay', 'Shivaji Sawant', 'A Hindi translation of the Marathi novel about Karna from the Mahabharata.', 399.00, 20, '9788126415236', (SELECT id FROM categories WHERE name = 'Mythology'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Kitne Pakistan', 'Kamleshwar', 'A Hindi novel that questions the partition of India and its consequences.', 299.00, 15, '9788126415243', (SELECT id FROM categories WHERE name = 'Historical Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg');

-- Bengali Books
INSERT INTO books (title, author, description, price, stock_quantity, isbn, category_id, image_url) VALUES
('Pather Panchali', 'Bibhutibhushan Bandyopadhyay', 'A Bengali novel that follows the life of a poor family in rural Bengal.', 349.00, 18, '9788126415250', (SELECT id FROM categories WHERE name = 'Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Gora', 'Rabindranath Tagore', 'A Bengali novel that explores themes of nationalism, religion, and social reform.', 399.00, 25, '9788126415267', (SELECT id FROM categories WHERE name = 'Classic Literature'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Chokher Bali', 'Rabindranath Tagore', 'A Bengali novel that deals with the consequences of a young widow''s desires and ambitions.', 299.00, 20, '9788126415274', (SELECT id FROM categories WHERE name = 'Classic Literature'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Shesher Kobita', 'Rabindranath Tagore', 'A Bengali novel that explores the complexities of modern human relationships.', 249.00, 15, '9788126415281', (SELECT id FROM categories WHERE name = 'Romance'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Feluda Series', 'Satyajit Ray', 'A collection of Bengali detective stories featuring the famous sleuth Feluda.', 599.00, 30, '9788126415298', (SELECT id FROM categories WHERE name = 'Mystery'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Pratidwandi', 'Sunil Gangopadhyay', 'A Bengali novel that portrays the socio-political scenario of Calcutta in the 1970s.', 279.00, 12, '9788126415304', (SELECT id FROM categories WHERE name = 'Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg');

-- Tamil Books
INSERT INTO books (title, author, description, price, stock_quantity, isbn, category_id, image_url) VALUES
('Ponniyin Selvan', 'Kalki Krishnamurthy', 'A historical Tamil novel set in the Chola dynasty.', 799.00, 22, '9788126415311', (SELECT id FROM categories WHERE name = 'Historical Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Sivagamiyin Sabatham', 'Kalki Krishnamurthy', 'A Tamil historical novel set in the Pallava dynasty.', 699.00, 15, '9788126415328', (SELECT id FROM categories WHERE name = 'Historical Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Parthiban Kanavu', 'Kalki Krishnamurthy', 'A Tamil historical novel set in the 8th century Pallava kingdom.', 499.00, 18, '9788126415335', (SELECT id FROM categories WHERE name = 'Historical Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Thirukkural', 'Thiruvalluvar', 'A classic Tamil text consisting of 1,330 couplets or kurals, dealing with the everyday virtues of an individual.', 399.00, 30, '9788126415342', (SELECT id FROM categories WHERE name = 'Philosophy'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Silappatikaram', 'Ilango Adigal', 'One of the Five Great Epics of Tamil Literature, telling the story of Kannagi.', 599.00, 15, '9788126415359', (SELECT id FROM categories WHERE name = 'Classic Literature'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg');

-- Malayalam Books
INSERT INTO books (title, author, description, price, stock_quantity, isbn, category_id, image_url) VALUES
('Aadujeevitham', 'Benyamin', 'A Malayalam novel about the struggles of a migrant worker in Saudi Arabia.', 349.00, 28, '9788126415366', (SELECT id FROM categories WHERE name = 'Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Randamoozham', 'M. T. Vasudevan Nair', 'A Malayalam novel retelling the Mahabharata from Bhima''s perspective.', 449.00, 18, '9788126415373', (SELECT id FROM categories WHERE name = 'Mythology'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Khasakkinte Itihasam', 'O. V. Vijayan', 'A landmark Malayalam novel that tells the story of a young man who arrives in Khasak.', 399.00, 15, '9788126415380', (SELECT id FROM categories WHERE name = 'Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Mayyazhippuzhayude Theerangalil', 'M. Mukundan', 'A Malayalam novel set in Mahe, a former French colony in India.', 299.00, 20, '9788126415397', (SELECT id FROM categories WHERE name = 'Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Chemmeen', 'Thakazhi Sivasankara Pillai', 'A Malayalam romantic tragedy novel about the relationship between Karuthamma and Pareekutty.', 249.00, 25, '9788126415403', (SELECT id FROM categories WHERE name = 'Romance'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg');

-- Telugu Books
INSERT INTO books (title, author, description, price, stock_quantity, isbn, category_id, image_url) VALUES
('Maha Prasthanam', 'Sri Sri', 'A collection of revolutionary Telugu poems.', 299.00, 25, '9788126415410', (SELECT id FROM categories WHERE name = 'Poetry'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Veyi Padagalu', 'Viswanatha Satyanarayana', 'A Telugu novel that won the Jnanpith Award.', 599.00, 15, '9788126415427', (SELECT id FROM categories WHERE name = 'Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Barrister Parvateesam', 'Mokkapati Narasimha Sastry', 'A Telugu humorous novel about the adventures of a young man who goes to England to study law.', 349.00, 20, '9788126415434', (SELECT id FROM categories WHERE name = 'Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Maidanam', 'Chalam', 'A Telugu novel that explores the themes of love, marriage, and freedom.', 299.00, 18, '9788126415441', (SELECT id FROM categories WHERE name = 'Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Kanyasulkam', 'Gurajada Apparao', 'A Telugu play that satirizes the practice of bride price and the treatment of widows.', 249.00, 22, '9788126415458', (SELECT id FROM categories WHERE name = 'Drama'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg');

-- Kannada Books
INSERT INTO books (title, author, description, price, stock_quantity, isbn, category_id, image_url) VALUES
('Samskara', 'U. R. Ananthamurthy', 'A Kannada novel that explores the conflict between tradition and modernity.', 349.00, 18, '9788126415465', (SELECT id FROM categories WHERE name = 'Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Mookajjiya Kanasugalu', 'K. Shivaram Karanth', 'A Kannada novel that won the Jnanpith Award.', 399.00, 22, '9788126415472', (SELECT id FROM categories WHERE name = 'Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Parva', 'S. L. Bhyrappa', 'A Kannada novel that retells the Mahabharata from a sociological and anthropological perspective.', 699.00, 15, '9788126415489', (SELECT id FROM categories WHERE name = 'Mythology'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Daatu', 'Poornachandra Tejaswi', 'A Kannada novel that explores the relationship between humans and nature.', 299.00, 20, '9788126415496', (SELECT id FROM categories WHERE name = 'Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Aavarana', 'S. L. Bhyrappa', 'A controversial Kannada novel that deals with the theme of religious conversion.', 399.00, 18, '9788126415502', (SELECT id FROM categories WHERE name = 'Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg');

-- Marathi Books
INSERT INTO books (title, author, description, price, stock_quantity, isbn, category_id, image_url) VALUES
('Yayati', 'V. S. Khandekar', 'A Marathi novel based on the Mahabharata character Yayati.', 349.00, 15, '9788126415519', (SELECT id FROM categories WHERE name = 'Mythology'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Shyamchi Aai', 'Sane Guruji', 'A Marathi novel about a mother''s influence on her son''s life.', 249.00, 20, '9788126415526', (SELECT id FROM categories WHERE name = 'Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Kosala', 'Bhalchandra Nemade', 'A Marathi novel that explores the journey of self-discovery of a young man.', 299.00, 18, '9788126415533', (SELECT id FROM categories WHERE name = 'Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Natsamrat', 'V. V. Shirwadkar', 'A Marathi play about an aged Shakespearean actor who has retired from stage.', 199.00, 25, '9788126415540', (SELECT id FROM categories WHERE name = 'Drama'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Vyakti Ani Valli', 'P. L. Deshpande', 'A collection of Marathi character sketches.', 249.00, 20, '9788126415557', (SELECT id FROM categories WHERE name = 'Non-Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg');

-- Gujarati Books
INSERT INTO books (title, author, description, price, stock_quantity, isbn, category_id, image_url) VALUES
('Saraswatichandra', 'Govardhanram Tripathi', 'A Gujarati novel considered a masterpiece of Indian literature.', 599.00, 15, '9788126415564', (SELECT id FROM categories WHERE name = 'Classic Literature'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Mari Hakikat', 'Narmad', 'An autobiography in Gujarati literature.', 299.00, 18, '9788126415571', (SELECT id FROM categories WHERE name = 'Biography'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Malela Jeev', 'Pannalal Patel', 'A Gujarati novel that portrays rural life in Gujarat.', 349.00, 20, '9788126415588', (SELECT id FROM categories WHERE name = 'Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Bhadrambhadra', 'Ramanbhai Neelkanth', 'A Gujarati satirical novel.', 249.00, 15, '9788126415595', (SELECT id FROM categories WHERE name = 'Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Manvini Bhavai', 'Pannalal Patel', 'A Gujarati novel set during the great famine of 1900 in Gujarat.', 399.00, 18, '9788126415601', (SELECT id FROM categories WHERE name = 'Historical Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg');

-- Punjabi Books
INSERT INTO books (title, author, description, price, stock_quantity, isbn, category_id, image_url) VALUES
('Pinjar', 'Amrita Pritam', 'A Punjabi novel set during the partition of India.', 349.00, 20, '9788126415618', (SELECT id FROM categories WHERE name = 'Historical Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Suhe Phull', 'Nanak Singh', 'A Punjabi novel that explores social issues.', 299.00, 15, '9788126415625', (SELECT id FROM categories WHERE name = 'Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Pavan Tera Rang Kala', 'Gurdial Singh', 'A Punjabi novel that portrays the life of a lower-caste boy.', 249.00, 18, '9788126415632', (SELECT id FROM categories WHERE name = 'Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Marhi Da Deeva', 'Gurdial Singh', 'A Punjabi novel about a farmer''s struggle against feudal society.', 299.00, 20, '9788126415649', (SELECT id FROM categories WHERE name = 'Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Ik Mian Do Talwaran', 'Nanak Singh', 'A Punjabi novel set during the British Raj.', 349.00, 15, '9788126415656', (SELECT id FROM categories WHERE name = 'Historical Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg');

-- Assamese Books
INSERT INTO books (title, author, description, price, stock_quantity, isbn, category_id, image_url) VALUES
('Miri Jiyori', 'Rajani Kanta Bordoloi', 'An Assamese novel that portrays the life of the Mising tribe.', 299.00, 15, '9788126415663', (SELECT id FROM categories WHERE name = 'Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Jivanar Batat', 'Bhabendra Nath Saikia', 'An Assamese novel that explores the complexities of human relationships.', 249.00, 18, '9788126415670', (SELECT id FROM categories WHERE name = 'Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Adha Lekha Dastavej', 'Indira Goswami', 'An Assamese autobiography.', 349.00, 20, '9788126415687', (SELECT id FROM categories WHERE name = 'Biography'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Mamare Dhara Tarowal', 'Jyoti Prasad Agarwala', 'An Assamese novel that portrays the freedom struggle.', 299.00, 15, '9788126415694', (SELECT id FROM categories WHERE name = 'Historical Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Chenabor Srot', 'Rajanikanta Bordoloi', 'An Assamese historical novel.', 349.00, 18, '9788126415700', (SELECT id FROM categories WHERE name = 'Historical Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg');

-- Odia Books
INSERT INTO books (title, author, description, price, stock_quantity, isbn, category_id, image_url) VALUES
('Chha Mana Atha Guntha', 'Fakir Mohan Senapati', 'An Odia novel that portrays the exploitation of landless peasants.', 299.00, 20, '9788126415717', (SELECT id FROM categories WHERE name = 'Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Matira Manisha', 'Kalindi Charan Panigrahi', 'An Odia novel that explores the theme of joint family.', 249.00, 15, '9788126415724', (SELECT id FROM categories WHERE name = 'Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Dura Pantha', 'Gopinath Mohanty', 'An Odia novel that portrays the life of tribal people.', 349.00, 18, '9788126415731', (SELECT id FROM categories WHERE name = 'Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Amrutara Santana', 'Gopinath Mohanty', 'An Odia novel that won the Jnanpith Award.', 399.00, 20, '9788126415748', (SELECT id FROM categories WHERE name = 'Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Paraja', 'Gopinath Mohanty', 'An Odia novel that portrays the life of tribal people in Odisha.', 349.00, 15, '9788126415755', (SELECT id FROM categories WHERE name = 'Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg');

-- English Books by Indian Authors
INSERT INTO books (title, author, description, price, stock_quantity, isbn, category_id, image_url) VALUES
('The God of Small Things', 'Arundhati Roy', 'A novel that won the Booker Prize, set in Kerala.', 399.00, 25, '9788126415762', (SELECT id FROM categories WHERE name = 'Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('The White Tiger', 'Aravind Adiga', 'A novel that won the Booker Prize, exploring the class struggle in India.', 349.00, 20, '9788126415779', (SELECT id FROM categories WHERE name = 'Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Midnight''s Children', 'Salman Rushdie', 'A novel that won the Booker Prize, set during India''s transition from British colonialism to independence.', 499.00, 18, '9788126415786', (SELECT id FROM categories WHERE name = 'Historical Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('The Inheritance of Loss', 'Kiran Desai', 'A novel that won the Booker Prize, set in the northeastern Himalayas.', 399.00, 15, '9788126415793', (SELECT id FROM categories WHERE name = 'Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('A Suitable Boy', 'Vikram Seth', 'A novel set in post-independence India.', 799.00, 20, '9788126415809', (SELECT id FROM categories WHERE name = 'Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('The Palace of Illusions', 'Chitra Banerjee Divakaruni', 'A retelling of the Mahabharata from Draupadi''s perspective.', 399.00, 25, '9788126415816', (SELECT id FROM categories WHERE name = 'Mythology'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('Train to Pakistan', 'Khushwant Singh', 'A historical novel about the partition of India.', 299.00, 18, '9788126415823', (SELECT id FROM categories WHERE name = 'Historical Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('The Guide', 'R. K. Narayan', 'A novel set in the fictional town of Malgudi.', 249.00, 20, '9788126415830', (SELECT id FROM categories WHERE name = 'Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('The Shadow Lines', 'Amitav Ghosh', 'A novel that explores the idea of boundaries.', 349.00, 15, '9788126415847', (SELECT id FROM categories WHERE name = 'Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg'),
('The Namesake', 'Jhumpa Lahiri', 'A novel about the Ganguli family, immigrants from India to the United States.', 399.00, 18, '9788126415854', (SELECT id FROM categories WHERE name = 'Fiction'), 'https://m.media-amazon.com/images/I/71JZ0rLfwdL._AC_UF1000,1000_QL80_.jpg');
