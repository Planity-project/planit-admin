import { Button, Input, message } from "antd";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { BannerFormStyled } from "./styled";
import api from "@/util/api";
import { useEffect, useState } from "react";
import clsx from "clsx";
import TitleCompo from "../TitleCompo";

interface FormState {
  title: string;
  image: File | null;
}

const validate = (values: FormState) => {
  const errors: any = {};

  if (!values.title) {
    errors.title = "제목을 입력하세요.";
  }

  if (!values.image) {
    errors.image = "이미지를 선택해주세요.";
  }
  return errors;
};

const BannerForm = () => {
  const router = useRouter();

  const formik = useFormik<FormState>({
    initialValues: {
      title: "",
      image: null,
    },
    validate,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const formData = new FormData();
        formData.append("title", values.title);
        if (values.image) {
          formData.append("image", values.image);
        }

        const res = await api.post("/banner/register", formData);
        message.success("배너가 등록되었습니다.");
        router.push("/bannerlist");
      } catch (err) {
        message.error("배너 등록 실패");
      } finally {
        setSubmitting(false);
      }
    },
  });
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (formik.values.image) {
      const file = formik.values.image;
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      return () => URL.revokeObjectURL(previewUrl);
    }
  }, [formik.values.image]);

  return (
    <BannerFormStyled className={clsx("banner-wrap")}>
      <form onSubmit={formik.handleSubmit}>
        <div className="form-head">
          <TitleCompo title="배너 등록" />
          <Button
            type="primary"
            htmlType="submit"
            disabled={formik.isSubmitting}
          >
            등록하기
          </Button>
        </div>
        <div className="form-item">
          <label className="form-label">제목</label>
          <Input
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            placeholder="배너 제목을 입력하세요."
          />
          {formik.touched.title && formik.errors.title && (
            <div className="form-error">{formik.errors.title}</div>
          )}
        </div>

        <div className="form-item">
          <label className="form-label">이미지 업로드</label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              formik.setFieldValue("image", e.currentTarget.files?.[0] || null);
            }}
          />
          {imagePreview && (
            <img src={imagePreview} alt="미리보기" className="form-image" />
          )}

          {formik.touched.image && formik.errors.image && (
            <div className="form-error">{formik.errors.image}</div>
          )}
        </div>
      </form>
    </BannerFormStyled>
  );
};

export default BannerForm;
