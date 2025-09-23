import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Recipe from "./pages/Recipe";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import ProfileSetting from "./components/ProfileSetting";
import SavedRecipies from "./components/SavedRecipies";
import PersonalRecipies from "./components/PersonalRecipies";
import AddRecipe from "./pages/AddRecipe";
import Profile from "./pages/Profile";
import AllRecipes from "./pages/AllRecipes";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminLayout from "./pages/AdminLayout";
import AdminRecipes from "./pages/AdminRecipes";
import AdminNotifications from "./pages/AdminNotifications";
import AdminBadges from "./pages/AdminBadges";
import AdminSingleUserDetailsPage from "./pages/AdminSingleUserDetailsPage";
import AdminSingleRecipePage from "./pages/AdminSingleRecipePage";
import AdminCollections from "./pages/AdminCollections";
import Collections from "./pages/Collections";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Unauthorized from "./pages/Unauthorized";
import AboutUs from "./pages/AboutUs";
import AdminCollectionPage from "./pages/AdminCollectionPage";
import AdminSingleCollectionPage from "./pages/AdminSingleCollectionPage";
import AdminCategoryPage from "./pages/AdminCategoryPage";
import AdminCategoryListPage from "./pages/AdminCategoryListPage";
import NoPageFound from "./pages/NoPageFound";
import AddNutrition from "./pages/AddNutrition";

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/c/:slug" element={<Category />} />
        <Route path="/recipe/:id" element={<Recipe />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route path="/recipe/all" element={<AllRecipes />} />
        <Route path="/collections/:collectionId" element={<Collections />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/about" element={<AboutUs />} />

        <Route path="/recipe/add-recipe" element={<AddRecipe />} />
        <Route
          path="/recipe/:recipeId/add-nutrition"
          element={<AddNutrition />}
        />

        <Route
          path="/account"
          element={
            <ProtectedRoute allowedRoles={["user", "admin"]}>
              <Account />{" "}
            </ProtectedRoute>
          }
        >
          <Route index element={<ProfileSetting />} />
          <Route path="edit-profile" element={<ProfileSetting />} />
          <Route path="saved" element={<SavedRecipies />} />
          <Route path="my-recipies" element={<PersonalRecipies />} />
        </Route>

        <Route path="/:userId" element={<Profile />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />{" "}
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="recipes" element={<AdminRecipes />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="badges" element={<AdminBadges />} />
          <Route path="user/:id" element={<AdminSingleUserDetailsPage />} />
          <Route path="recipe/:id" element={<AdminSingleRecipePage />} />
          <Route path="collections" element={<AdminCollectionPage />} />
          <Route
            path="collections/:collectionId"
            element={<AdminSingleCollectionPage />}
          />
          <Route path="collections/:id/edit" element={<AdminCollections />} />
          <Route path="collections/add" element={<AdminCollections />} />
          <Route path="category" element={<AdminCategoryListPage />} />
          <Route path="category/add" element={<AdminCategoryPage />} />
        </Route>
        <Route path="*" element={<NoPageFound />} />
      </Routes>
    </div>
  );
};

export default App;
