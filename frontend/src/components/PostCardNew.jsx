import React, { useState } from "react";
import {
  BadgeCheck,
  MapPin,
  Tag,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  Building2,
  Clock,
} from "lucide-react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "@clerk/react";
import api from "../api/axios";
import toast from "react-hot-toast";

// Priority badge colours
const PRIORITY_STYLES = {
  high: "bg-red-100 text-red-700 border border-red-200",
  medium: "bg-yellow-100 text-yellow-700 border border-yellow-200",
  low: "bg-green-100 text-green-700 border border-green-200",
};

// Status badge colours
const STATUS_STYLES = {
  pending: "bg-gray-100 text-gray-600 border border-gray-200",
  assigned: "bg-blue-100 text-blue-700 border border-blue-200",
  in_progress: "bg-indigo-100 text-indigo-700 border border-indigo-200",
  resolved: "bg-green-100 text-green-700 border border-green-200",
  rejected: "bg-red-100 text-red-700 border border-red-200",
};

const PostCardNew = ({ post }) => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const currentUser = useSelector((state) => state.user.value);

  const [votes, setVotes] = useState(post.votes_count || []);
  const [imgIndex, setImgIndex] = useState(0);

  const images = post.image_urls || [];

  const handleVote = async () => {
    try {
      const { data } = await api.post(
        "/api/post/vote",
        { postId: post._id },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      if (data.success) {
        toast.success(data.message);
        setVotes((prev) =>
          prev.includes(currentUser._id)
            ? prev.filter((id) => id !== currentUser._id)
            : [...prev, currentUser._id]
        );
      } else {
        toast(data.message);
      }
    } catch (error) {
      toast.error("Failed to vote.");
    }
  };

  const prevImg = (e) => {
    e.stopPropagation();
    setImgIndex((i) => (i - 1 + images.length) % images.length);
  };
  const nextImg = (e) => {
    e.stopPropagation();
    setImgIndex((i) => (i + 1) % images.length);
  };

  const priority = post.priority || "low";
  const status = post.status || "pending";
  const hasVoted = votes.includes(currentUser?._id);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full max-w-2xl hover:shadow-md transition-shadow">
      {/* ── Image carousel ── */}
      {images.length > 0 && (
        <div className="relative w-full h-40 bg-gray-100 overflow-hidden">
          <img
            src={images[imgIndex]}
            alt="issue"
            className="w-full h-full object-contain"
          />
          {images.length > 1 && (
            <>
              <button
                onClick={prevImg}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextImg}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-1 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_, i) => (
                  <span
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      i === imgIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Status + Priority overlay */}
          <div className="absolute top-2 left-2 flex gap-1.5">
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${STATUS_STYLES[status]}`}
            >
              {status.replace("_", " ")}
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${PRIORITY_STYLES[priority]}`}
            >
              {priority}
            </span>
          </div>
        </div>
      )}

      <div className="p-4 space-y-3">
        {/* ── Reporter ── */}
        <div
          onClick={() => navigate("/profile/" + (post.user?._id || post.user))}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <img
            src={post.user?.profile_picture || "https://via.placeholder.com/40"}
            alt=""
            className="w-9 h-9 rounded-full shadow border border-gray-200"
          />
          <div>
            <div className="flex items-center gap-1 text-sm font-semibold text-gray-800 group-hover:text-green-700 transition-colors">
              {post.user?.full_name || "Citizen"}
              <BadgeCheck className="w-3.5 h-3.5 text-blue-500" />
            </div>
            <p className="text-xs text-gray-400">
              @{post.user?.username || "user"} •{" "}
              {moment(post.createdAt).fromNow()}
            </p>
          </div>

          {/* Status + priority badges (no image case) */}
          {images.length === 0 && (
            <div className="ml-auto flex gap-1.5">
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${STATUS_STYLES[status]}`}
              >
                {status.replace("_", " ")}
              </span>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${PRIORITY_STYLES[priority]}`}
              >
                {priority}
              </span>
            </div>
          )}
        </div>

        {/* ── Title ── */}
        {post.title && (
          <h3 className="text-base font-bold text-gray-900 leading-tight">
            {post.title}
          </h3>
        )}

        {/* ── Description ── */}
        {post.desc && (
          <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
            {post.desc}
          </p>
        )}

        {/* ── Meta pills ── */}
        <div className="flex flex-wrap gap-2 pt-0.5">
          {post.category && (
            <span className="flex items-center gap-1 text-xs text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full font-medium">
              <Tag className="w-3 h-3" />
              {post.category}
              {post.subCategory ? ` · ${post.subCategory}` : ""}
            </span>
          )}
          {post.location && (
            <span className="flex items-center gap-1 text-xs text-gray-600 bg-gray-50 border border-gray-200 px-2.5 py-0.5 rounded-full">
              <MapPin className="w-3 h-3" />
              {post.location}
            </span>
          )}
        </div>

        {/* ── AI Suggested Department ── */}
        {post.aiSuggestedDepartment && (
          <div className="flex items-start gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
            <Building2 className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wide leading-none mb-0.5">
                Ai Suggested Department
              </p>
              <p className="text-xs text-slate-700 font-semibold">
                {post.aiSuggestedDepartment}
              </p>
            </div>
          </div>
        )}

        {/* ── Action bar ── */}
        <div className="flex items-center gap-4 pt-2 border-t border-gray-100 text-gray-500 text-xs">
          {/* Upvote */}
          <button
            onClick={handleVote}
            className={`flex items-center gap-1.5 font-medium transition-colors ${
              hasVoted ? "text-green-600" : "hover:text-green-600"
            }`}
          >
            <ThumbsUp
              className={`w-4 h-4 ${
                hasVoted ? "fill-green-600 text-green-600" : ""
              }`}
            />
            <span>
              {votes.length} {votes.length === 1 ? "Upvote" : "Upvotes"}
            </span>
          </button>

          {/* Timestamp */}
          <span className="ml-auto flex items-center gap-1 text-gray-400">
            <Clock className="w-3 h-3" />
            {moment(post.createdAt).format("MMM D, YYYY")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostCardNew;
