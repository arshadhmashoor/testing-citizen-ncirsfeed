import React, { useState, useEffect } from "react";
import Loading from "../components/Loading";
import PostCardNew from "../components/PostCardNew";
import { useAuth } from "@clerk/react";
import { useSelector } from "react-redux";
import api from "../api/axios";
import toast from "react-hot-toast";

const MyIssues = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();
  const user = useSelector((state) => state.user.value);

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/post/myposts", {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });
      if (data.success) {
        setPosts(data.posts);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="h-full overflow-y-scroll bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          {user?.profile_picture && (
            <img
              src={user.profile_picture}
              className="w-10 h-10 rounded-full shadow"
              alt=""
            />
          )}
          <div>
            <h1 className="text-xl font-bold text-gray-800">My Issues</h1>
            <p className="text-sm text-gray-500">
              {posts.length} issue{posts.length !== 1 ? "s" : ""} posted
            </p>
          </div>
        </div>

        {/* Posts */}
        {posts.length > 0 ? (
          <div className="flex flex-col items-center gap-5">
            {posts.map((post) => (
              <PostCardNew key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-sm font-medium">No issues posted yet</p>
            <p className="text-xs mt-1">
              Click "Report New Issues" to submit your first issue
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyIssues;

// import React, { useState, useEffect } from "react";
// import Loading from "../components/Loading";
// import PostCardNew from "../components/PostCardNew";
// import { useAuth } from "@clerk/react";
// import { useSelector } from "react-redux";
// import api from "../api/axios";
// import toast from "react-hot-toast";

// const MyIssues = () => {
//   const { profileId } = useParams();
//   const [user, setUser] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [activeTab, setActiveTab] = useState("posts");
//   const [showEdit, setShowEdit] = useState("false");

//   const fetchUser = async () => {
//     setUser(dummyUserData);
//     setPosts(dummyPostsData);
//   };

//   useEffect(() => {
//     fetchUser();
//   }, []);

//   return user ? (
//     <div className=" relative h-full overflow-y-scroll bg-gray-50 p-6">
//       <div className=" max-w-3xl mx-auto">
//         {/*profile card */}
//         <div className="bg-white rounded-2xl shadow overflow-hidden">
//           {/*cover photo */}
//           {/* <div className="h-40 md:h-56 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">
//             {user.cover_photo && (
//               <img
//                 src={user.cover_photo}
//                 alt=""
//                 className="w-full h-full object-cover"
//               />
//             )}
//           </div> */}
//           {/**user infor */}
//           {/* <UserProfileInfo user={user} posts={posts} profileId={profileId} /> */}
//         </div>

//         {/*tabs */}
//         <div className="mt-6">
//           <div className="bg-white rounded-xl shadow p-1 flex max-w-md mx-auto">
//             <h2>my Posted Issues</h2>
//             {/* {["posts", "media", "likes"].map(
//               (tab = (
//                 <button
//                   key={tab}
//                   className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
//                     activeTab === tab
//                       ? "bg-indigo-600 text-white"
//                       : "text-gray-600 hover:text-gray-900"
//                   }`}
//                 >
//                   {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                 </button>
//               ))
//             )} */}
//           </div>
//           {/**posts/ issues  */}
//           {activeTab === "posts" && (
//             <div className="mt-6 flex flex-col items-center gap-6">
//               {posts.map((post) => (
//                 <PostCardNew key={post._id} post={post} />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   ) : (
//     <Loading />
//   );
// };

// export default MyIssues;
