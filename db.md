<!-- Các công nghệ sử dụng -->

    - Frontend: HTML - SCSS - tailwind css - JS -  ReactJS(router, yup, react hook form)
    - Backend:
        + Create database bằng firebase
        + Built REST API với firebase clound functions, firestore và expressJS (call API để CRUD database)
            + setting up firebase
            + viết clound fun đầu tiên
                +  cloud functions ở local ta chạy command: npm run serve
            + Kết hợp Express để xây dựng REST API
                +  Tạo account service cho app: Để truy cập vào Firestore và admin tool từ app, ta cần phải tạo 1 service account
                +  Cấu hình firebase admin
            + Xây dựng controller để nhận http request, thao tác với firestore

<!-- Chức năng -->

    - Login: đăng nhập với tài khoản của user đã đăng ký (Có validate form login + Sẽ ko đăng nhập đc nếu ko tồn tại account và thông báo cho user)


    - Register: Tạo tài khoản user (validate form + nếu tài khoản đã có nó sẽ không được tạo và thông báo cho user)


    - Home page:
        + Lấy dữ liệu render UI
        + Header sẽ có avatar click vào sẽ router đến update profile của user
        + Dashboard trên header là nơi quản lý bài viết,feedback của user hiện tại
            + trong dashboard có chức năng filter search theo title của post
            + Xem, thêm, sửa, xóa posts của user hiện tại
        + Admin là người có quyền xem các post, category, user,feedback, mỗi cái sẽ có filter theo field và xem, thêm, sửa, xóa posts.
            + Post nào bị reject thì sẽ ko render ra UI


    - Blog page:
        + Render các blog trong database
            + Mỗi blog khi click vào title, image sẽ router đến Post's Detail theo cái slug trong db.
            + Khi click vào category sẽ router đến các blog mà có cái category đó.
            + Khi click vào author sẽ router đến các blog mà có author đó.
        + Detail page:
            + Render data của post đó ra UI
            + Mỗi BLog sẽ có chức năng comment, user có thể commment blog đó
            + Mỗi comment sẽ có thể edit, delete (user nào comment mới có quyền edit, delete)
            + Render bài viết liên quan.


    - feedback page:
        + message được user hiện tại gửi đi(validate form)


        **** Mỗi chức năng delete sẽ có hỏi ý kiến có muốn xóa không.
        **** Mỗi chức năng edit đều hiển thị các data lên input ngay.

<!-- database -->

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
-   comment: comment, createAt, userComment,
-   category: id, name, slug, status, createAt

# Category

-   id
-   name
-   slug
-   status: 1(approved) 2(unapproved)
-   createdAt

# User

-   id
-   fullname
-   username
-   email
-   password
-   description
-   avatar
-   status: 1(active) 2(pending) 3(ban)
-   role: 1(Admin) 2(Mod) 3(EDITOR) 4(User)
-   createdAt
-   dateOfBirth
-   mobileNumber

# feedback

-   id
-   fullname
-   email
-   user
-   message
-   createAt

<!--  check add posts trong postman -->

    {
        "title":"Scroll snap là gì ? Tìm hiểu chuyên sâu về CSS Scroll Snap",
        "slug":"scroll-snap-la-gi",
        "image":"https://evondev.com/wp-content/uploads/2021/01/css-scroll-snap.jpg",
        "category":{
            "createdAt": 1673080198538,
            "id" : 1673080198538,
            "name":"HTML-CSS",
            "slug":"html-css",
            "status":1
        },
        "status":1,
        "hot":false,
        "content":"Hi! Xin chào các bạn hôm nay mình lại mang đến cho các bạn một bài viết mới khá là hay và chất lượng được tham khảo và viết lại dưới ngôn ngữ của chúng ta dựa trên bài viết gốc của tác giả Ishadeed. Trong bài viết này mình và các bạn sẽ cùng nhau tìm hiểu về CSS Scroll Snap nhé để xem thử nó là cái gì ? Và áp dụng vào thực tế ra sao nha.Tại sao phải dùng scroll-snap ? Chắc các bạn cũng biết nhu cầu sử dụng các thiết bị mobile, tablet ngày càng nhiều thì các trang web chúng ta phát triển việc phải có Responsive là đương nhiên, kèm theo đó là UX(trải nghiệm người dùng) trên các thiết bị đó. Ví dụ như một danh sách hình ảnh, nếu chúng ta để hiển thị chiều dọc trên điện thoại thì buộc người dùng phải scroll rất nhiều do đó phải tối ưu làm sao để người dùng có thể lướt qua xem dễ dàng hơn(scroll ngang).",
        "user":{
            "avatar" :"https://firebasestorage.googleapis.com/v0/b/monkey-bloging-17bb9.appspot.com/o/images%2Favatar-1606916__340.webp?alt=media&token=29e29842-4bee-4f17-99e6-bda03538fb00",
            "createdAt":1673084204911,
            "description":"Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit, ab. Quod, nesciunt ab odio omnis iusto molestias totam sit eius quasi corporis, laudantium, aliquam repudiandae consequatur soluta incidunt dicta neque. ",
            "email": "ngokien123@gmail.com",
            "fullname":"Ngô Kiên123",
            "id":1673084204911,
            "password":"ngokien123",
            "role": 4,
            "status":1,
            "username":"ngo-kien123"
        },
        "comment":""
    }
