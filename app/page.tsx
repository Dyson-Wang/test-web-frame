"use client";
import Image from "next/image";
import { useState } from "react";
import hanfuapi from "@/utils/api";

interface UploadResponse {
  message: string;
}

export default function Home() {
  const [image, setImage] = useState<string | null>(null); // 存储图片的 Base64 编码
  const [file, setFile] = useState<File | null>(null); // 存储用户选择的文件对象

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // 将文件转换为 Base64 编码
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImage(reader.result as string); // 将 Base64 编码存储到 state
        }
      };
      reader.readAsDataURL(selectedFile); // 读取文件内容为 Base64
    }
  };

  // 提交表单并发送 Base64 数据到服务器
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!image) {
      alert("请先选择图片！");
      return;
    }

    try {
      hanfuapi(image);
    } catch (error) {
      console.error("上传失败:", error);
      alert("上传失败，请稍后再试！");
    }
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "30vw",
          height: "20vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button
          type="submit"
          style={{
            width: "100px",
            height: "30px",
            backgroundColor: "black",
            color: "white",
          }}
        >
          上传
        </button>
      </form>
      <div>
        <h2>预览：</h2>
        <div>
          {image && (
            <img
              src={image}
              alt="Uploaded"
              style={{
                width: "300px",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
