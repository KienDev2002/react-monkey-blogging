# Post

-   id
-   title
-   slug
-   image
-   createdAt
-   status: 1(approved) 2(pending) 3(reject)
-   hot: true,false: post nổi bật
-   content
-   user: id, username, fullname, avatar, description
-   category: id, name, slug

# Category

-   id
-   name
-   slug
-   status: 1(approved) 2(unapproved)
-   createdAt

# User

-   id
-   displayName
-   username
-   email
-   password
-   description
-   avatar: url: lấy url , image_name: để xóa ảnh
-   status: 1(active) 2(pending) 3(ban)
-   role: 1(Admin) 2(Mod) 3(User)
-   permissions: "ADD_POST"
-   createdAt

--

Hướng dẫn setup phòng cực chill dành cho người mới toàn tập
