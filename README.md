# Life Balance - Health & Nutrition Website

## Overview

Life Balance is a web platform designed for users who aim to maintain a healthy lifestyle. The website provides personalized health tracking, access to a vast collection of nutritious recipes, and tools to help users achieve their fitness and dietary goals. Users can monitor their progress, receive personalized recommendations, and explore global BMI trends. The intuitive and engaging user interface ensures a seamless experience while supporting users on their health journey.

---

## Website Pages

### Home Page

**Screenshot:**

![image](https://github.com/user-attachments/assets/bdd5a0d1-d7c7-4cc2-bec9-96805471fb73)


**Description:**
The home page provides an introduction to the platform, highlighting the key features and services. Users can easily navigate to various sections such as recipes, BMI analysis, and their personal dashboard.

---

### About Us

**Screenshot:**![image](https://github.com/user-attachments/assets/b6ba6ad1-33fe-42e8-b578-bbe3815f3e00)


**Description:**
The About Us page provides an overview of the mission and vision of Life Balance, explaining how the platform helps users achieve a healthier lifestyle.

---

### User Registration

**Screenshot:**

![image](https://github.com/user-attachments/assets/d101b799-6744-411e-b38d-410fb93f01ed)

![image](https://github.com/user-attachments/assets/2459982a-2523-4184-bf2b-f8a938bbed54)

![image](https://github.com/user-attachments/assets/bad2223d-1076-45fb-8929-057b4ca67811)

![image](https://github.com/user-attachments/assets/e7f40013-2da9-4472-acc4-e4fa36eb8ff3)

![image](https://github.com/user-attachments/assets/6e0b3df5-9f1b-4b07-8f29-56597da4ef48)

![image](https://github.com/user-attachments/assets/f8800586-27cd-4533-bb35-7a297ce84bd7)


**Description:**
New users go through a simple step-by-step registration process, where they input their personal details, fitness goals, allergies, and activity levels. This data is stored in the `users` table.

**Database Usage:**

- Table: `users` (stores user details like height, weight, goal, allergies, etc.)

---

### User Login

**Screenshot:** 

![image](https://github.com/user-attachments/assets/77997f24-1802-49a0-8327-9b2f3129ac73)


**Description:**
Existing users can securely log in to access their personalized dashboard.

---

### Personal Area

**Screenshot:**

![image](https://github.com/user-attachments/assets/3c28788c-2e96-4935-95d2-f32ea3bda264)


**Description:**
Users can view their BMI trends, personal progress, and update their health-related information. The page visualizes progress data with interactive charts.

**Database Usage:**

- Table: `bmi_history` (tracks user BMI changes over time)
- Table: `users` (stores personal details)
- Complex Query: Calculates user success rate in achieving goals.

---

### Recipes;

**Screenshot:**

![image](https://github.com/user-attachments/assets/2214eaa9-59e1-473a-9471-83a485a16739)

![image](https://github.com/user-attachments/assets/7ab3674f-91ff-4f9b-af00-e03cd3e56135)

![image](https://github.com/user-attachments/assets/c4557521-cb18-4550-9dbf-b26bbc43afa4)

![image](https://github.com/user-attachments/assets/6511f060-631f-4ca9-956b-b40104e83bc6)


**Description:**
Users can browse a variety of healthy recipes, filter them based on nutritional values, cooking time, and allergens.

**Database Usage:**

- Table: `recipes` (stores recipe details including ingredients, nutrition, preparation steps)
- Table: `index_allergy_*` (allergy-specific recipe indexes)
- Complex Query: Filters recipes based on user preferences and nutritional content.

---

### Nutrient Calculator

**Screenshot:**

![image](https://github.com/user-attachments/assets/95a531e9-3879-41ec-b36a-0e19b8913942)


**Description:**
Users can calculate their daily caloric intake and macronutrient needs based on their health goals and activity level.

**Database Usage:**

- Table: `food` (stores nutritional values for food items)
- Complex Query: Fetches nutritional data for selected food items.

---

### Learn More

**Screenshot:**

![image](https://github.com/user-attachments/assets/8cb1f818-1de1-4299-b9d6-c6409162be4e)

![image](https://github.com/user-attachments/assets/a1171f93-c2ce-4f2b-b6f0-7624caa22868)

![image](https://github.com/user-attachments/assets/aec7625f-4a13-462e-8d7a-4da4969329fe)

![image](https://github.com/user-attachments/assets/e39b9452-4631-482e-ae8d-f819c8d12972)


**Description:**
This page visualizes worldwide BMI data trends over time, allowing users to compare global health statistics.

**Database Usage:**

- Table: `global_bmi_data` (stores BMI data by country and year)

---

## Database Structure

Below is an overview of the tables used in the project:

### Tables:

![image](https://github.com/user-attachments/assets/00b78f11-fb88-4766-a5be-079c54eefd65)


### `users`

![image](https://github.com/user-attachments/assets/fe26a6df-29fe-4570-9121-75363773af1c)


**Columns:** id, username, date\_of\_birth, email, password, height, weight, gender, activity\_index, purpose, allergies
**Purpose:** Stores user account details and health-related information.

### `bmi_history`

![image](https://github.com/user-attachments/assets/cc22656a-203e-4ef5-bd85-d20e2665d726)


**Columns:** user\_id, date, bmi
**Purpose:** Tracks BMI history for each user to monitor progress.

### `recipes`

![image](https://github.com/user-attachments/assets/c6fba858-2b90-423f-b3c2-e42ce1f2c9d3)


**Columns:** id, name, minutes, tags, nutrition, steps, ingredients, photo, uploader
**Purpose:** Stores healthy recipes with details on preparation time, ingredients, and nutritional values.

### `global_bmi_data`

![image](https://github.com/user-attachments/assets/6752a8dc-506e-41d3-9751-3c5a303c932f)


**Columns:** country, year, gender, bmi, bmi\_min, bmi\_max
**Purpose:** Contains BMI trends across different countries and years.

### `index_allergy_*`

![image](https://github.com/user-attachments/assets/0a3b877c-bead-45be-a5e9-54f561a322dd)

![image](https://github.com/user-attachments/assets/6dd87b16-07af-42db-a5bb-d6c048e75125)

![image](https://github.com/user-attachments/assets/d3ca7f8f-002c-4770-98be-cf9ac354e423)

![image](https://github.com/user-attachments/assets/a567dec5-04a6-4ed7-af2d-0c0ec16852a2)

![image](https://github.com/user-attachments/assets/18cca66a-6fd5-41f5-a5c1-dbd3db6f8761)

![image](https://github.com/user-attachments/assets/571cbf61-d24b-4231-a87f-54dc120c9e7a)

![image](https://github.com/user-attachments/assets/88689339-1c75-4d7c-b481-ce25c4939cf1)

![image](https://github.com/user-attachments/assets/38556bf2-b7e9-4376-a5ff-edc4a3eb6b9c)


**Columns:** id, name, ingredients, nutrition, photo, minutes
**Purpose:** Stores allergy-friendly recipe indexes for filtering recipes based on dietary restrictions.

### `food`

![image](https://github.com/user-attachments/assets/4e55f8ad-c2fb-42f5-8c3c-b9fef0ae2c69)


**Columns:** food\_name, caloric\_value, fat, protein, carbohydrates, etc.
**Purpose:** Stores nutritional data for individual food items.

### nutrition_descriptions

![image](https://github.com/user-attachments/assets/0adec9f7-4984-431e-b952-e00fb4aea9f4)


**Columns:** nutrient_name, description
**Purpose:** Provides detailed descriptions of various nutrients and their benefits.

---

## Complex SQL Queries

### 1. Recipe Filtering Based on User Preferences

**Screenshot:** 

![image](https://github.com/user-attachments/assets/adb4c273-212c-43b2-b218-a40cf426ee78)

**Purpose:** Filters recipes based on user-defined calorie limits and ingredient preferences.

---

### 2. Most Popular Recipes

**Screenshot:**

![image](https://github.com/user-attachments/assets/08a7d759-efe9-4784-ba9e-71a89e949c45)

**Purpose:** Retrieves the top 10 most saved recipes in the past month.

---

### 3. User Success Calculation

**Screenshot:**

![image](https://github.com/user-attachments/assets/6f91c69e-fd75-40af-a2e7-a9251bd3d298)

**Purpose:** Calculates how many users successfully achieved their weight goal (weight loss, gain, or maintenance).

---

### 4. Recipe Category Distribution

**Screenshot:**

![image](https://github.com/user-attachments/assets/64c9e098-6459-4c3a-b0d7-49a7fc4c1fd6)

**Purpose:** Extracts the most common recipe categories by analyzing recipe tags.

---

## Conclusion

Life Balance provides a comprehensive health and nutrition tracking experience for users seeking a balanced lifestyle. By integrating personalized data, global statistics, and user-driven recipes, it ensures an engaging and effective health management tool.

---

**Developed by:** [Michal Beldi, Noy Shani]\
**Year:** 2025\
**Technologies Used:** MySQL, JavaScript, HTML/CSS, Node.js
