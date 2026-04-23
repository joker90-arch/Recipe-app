import React, { useMemo, useState } from "react"; import { motion } from "framer-motion"; import { Search, Plus, Clock3, Users, Heart, MessageSquare, ChefHat, Bookmark, Star } from "lucide-react"; import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; import { Button } from "@/components/ui/button"; import { Input } from "@/components/ui/input"; import { Textarea } from "@/components/ui/textarea"; import { Badge } from "@/components/ui/badge"; import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"; import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; import { Separator } from "@/components/ui/separator";

const initialRecipes = [ { id: 1, title: "매콤 참치김치볶음밥", author: "내 레시피", category: "자취요리", time: "15분", servings: "1인분", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1200&auto=format&fit=crop", ingredients: ["밥 1공기", "김치 1컵", "참치 1캔", "고추장 1/2큰술", "참기름 약간"], steps: [ "팬에 김치와 참치를 먼저 볶아준다.", "밥과 고추장을 넣고 고르게 볶는다.", "마지막에 참기름을 넣고 마무리한다.", ], likes: 18, saved: 9, reviews: [ { id: 1, user: "민지", rating: 5, difficulty: "쉬움", text: "간단한데 맛이 진해서 자취 메뉴로 좋았어요." }, { id: 2, user: "준호", rating: 4, difficulty: "보통", text: "조금 짜서 김치를 덜 넣으니 더 좋았어요." }, ], }, { id: 2, title: "오버나이트 요거트 과일볼", author: "소연키친", category: "다이어트", time: "10분", servings: "2인분", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=1200&auto=format&fit=crop", ingredients: ["그릭요거트", "바나나", "블루베리", "그래놀라", "꿀"], steps: [ "그릇에 그릭요거트를 담는다.", "과일과 그래놀라를 올린다.", "기호에 맞게 꿀을 뿌린다.", ], likes: 11, saved: 17, reviews: [{ id: 1, user: "하린", rating: 5, difficulty: "쉬움", text: "아침 대용으로 부담 없고 예뻐요." }], }, { id: 3, title: "간장계란버터밥", author: "주말집밥", category: "초간단", time: "5분", servings: "1인분", image: "https://images.unsplash.com/photo-1516684732162-798a0062be99?q=80&w=1200&auto=format&fit=crop", ingredients: ["밥", "계란", "간장", "버터", "김가루"], steps: [ "계란 프라이를 만든다.", "밥 위에 버터와 간장을 넣는다.", "계란과 김가루를 올려 비벼 먹는다.", ], likes: 24, saved: 22, reviews: [{ id: 1, user: "지우", rating: 4, difficulty: "쉬움", text: "밤에 출출할 때 최고예요." }], }, ];

const categories = ["전체", "자취요리", "다이어트", "초간단", "한식", "양식", "디저트"];

function RatingStars({ value = 0 }) { return ( <div className="flex items-center gap-1"> {Array.from({ length: 5 }).map((_, i) => ( <Star key={i} className={h-4 w-4 ${i < value ? "fill-current text-yellow-500" : "text-gray-300"}} /> ))} </div> ); }

export default function RecipeReviewApp() { const [recipes, setRecipes] = useState(initialRecipes); const [selectedId, setSelectedId] = useState(initialRecipes[0].id); const [search, setSearch] = useState(""); const [category, setCategory] = useState("전체"); const [open, setOpen] = useState(false);

const [newRecipe, setNewRecipe] = useState({ title: "", author: "내 레시피", category: "자취요리", time: "", servings: "", image: "", ingredients: "", steps: "", });

const [reviewForm, setReviewForm] = useState({ user: "", rating: "5", difficulty: "쉬움", text: "", });

const filteredRecipes = useMemo(() => { return recipes.filter((recipe) => { const matchesSearch = recipe.title.toLowerCase().includes(search.toLowerCase()) || recipe.ingredients.join(" ").toLowerCase().includes(search.toLowerCase()); const matchesCategory = category === "전체" ? true : recipe.category === category; return matchesSearch && matchesCategory; }); }, [recipes, search, category]);

const selectedRecipe = recipes.find((r) => r.id === selectedId) || filteredRecipes[0] || recipes[0];

const avgRating = (reviews) => { if (!reviews?.length) return 0; const total = reviews.reduce((sum, review) => sum + Number(review.rating), 0); return (total / reviews.length).toFixed(1); };

const handleCreateRecipe = () => { if (!newRecipe.title.trim() || !newRecipe.ingredients.trim() || !newRecipe.steps.trim()) return;

const created = {
  id: Date.now(),
  title: newRecipe.title,
  author: newRecipe.author || "내 레시피",
  category: newRecipe.category,
  time: newRecipe.time || "미정",
  servings: newRecipe.servings || "미정",
  image:
    newRecipe.image ||
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1200&auto=format&fit=crop",
  ingredients: newRecipe.ingredients.split("\n").filter(Boolean),
  steps: newRecipe.steps.split("\n").filter(Boolean),
  likes: 0,
  saved: 0,
  reviews: [],
};

setRecipes((prev) => [created, ...prev]);
setSelectedId(created.id);
setNewRecipe({
  title: "",
  author: "내 레시피",
  category: "자취요리",
  time: "",
  servings: "",
  image: "",
  ingredients: "",
  steps: "",
});
setOpen(false);

};

const handleAddReview = () => { if (!selectedRecipe || !reviewForm.user.trim() || !reviewForm.text.trim()) return;

const newReview = {
  id: Date.now(),
  user: reviewForm.user,
  rating: Number(reviewForm.rating),
  difficulty: reviewForm.difficulty,
  text: reviewForm.text,
};

setRecipes((prev) =>
  prev.map((recipe) =>
    recipe.id === selectedRecipe.id
      ? { ...recipe, reviews: [newReview, ...recipe.reviews] }
      : recipe
  )
);

setReviewForm({ user: "", rating: "5", difficulty: "쉬움", text: "" });

};

return ( <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-white text-slate-900"> <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 lg:px-8"> <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 grid gap-4 lg:grid-cols-[1.4fr_0.9fr]" > <Card className="rounded-3xl border-0 shadow-sm"> <CardContent className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between"> <div> <div className="mb-2 flex items-center gap-2 text-orange-500"> <ChefHat className="h-5 w-5" /> <span className="text-sm font-medium">레시피 + 먹은 후기 앱</span> </div> <h1 className="text-3xl font-bold tracking-tight">해먹고 남기는 레시피 앱</h1> <p className="mt-2 text-sm text-slate-600 md:text-base"> 내가 올린 레시피를 기록하고, 직접 먹어본 뒤 짧은 리뷰까지 남길 수 있는 구조로 만든 MVP입니다. </p> </div>

<Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-2xl px-5 py-6 text-base">
                <Plus className="mr-2 h-4 w-4" />
                레시피 올리기
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl rounded-3xl">
              <DialogHeader>
                <DialogTitle>새 레시피 등록</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3">
                <Input
                  placeholder="레시피 제목"
                  value={newRecipe.title}
                  onChange={(e) => setNewRecipe({ ...newRecipe, title: e.target.value })}
                />
                <div className="grid gap-3 md:grid-cols-2">
                  <Input
                    placeholder="작성자"
                    value={newRecipe.author}
                    onChange={(e) => setNewRecipe({ ...newRecipe, author: e.target.value })}
                  />
                  <Select
                    value={newRecipe.category}
                    onValueChange={(value) => setNewRecipe({ ...newRecipe, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter((c) => c !== "전체").map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <Input
                    placeholder="조리 시간 예: 15분"
                    value={newRecipe.time}
                    onChange={(e) => setNewRecipe({ ...newRecipe, time: e.target.value })}
                  />
                  <Input
                    placeholder="인분 예: 2인분"
                    value={newRecipe.servings}
                    onChange={(e) => setNewRecipe({ ...newRecipe, servings: e.target.value })}
                  />
                </div>
                <Input
                  placeholder="대표 이미지 URL"
                  value={newRecipe.image}
                  onChange={(e) => setNewRecipe({ ...newRecipe, image: e.target.value })}
                />
                <Textarea
                  placeholder={`재료를 줄바꿈으로 입력\n예)\n계란 2개\n간장 1큰술`}
                  value={newRecipe.ingredients}
                  onChange={(e) => setNewRecipe({ ...newRecipe, ingredients: e.target.value })}
                  className="min-h-[120px]"
                />
                <Textarea
                  placeholder={`조리 순서를 줄바꿈으로 입력\n예)\n팬을 예열한다\n재료를 넣고 볶는다`}
                  value={newRecipe.steps}
                  onChange={(e) => setNewRecipe({ ...newRecipe, steps: e.target.value })}
                  className="min-h-[140px]"
                />
                <Button onClick={handleCreateRecipe} className="rounded-2xl">등록하기</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-0 shadow-sm">
        <CardContent className="grid grid-cols-3 gap-3 p-6 text-center">
          <div className="rounded-2xl bg-orange-50 p-4">
            <div className="text-2xl font-bold">{recipes.length}</div>
            <div className="text-sm text-slate-600">등록 레시피</div>
          </div>
          <div className="rounded-2xl bg-rose-50 p-4">
            <div className="text-2xl font-bold">{recipes.reduce((sum, r) => sum + r.reviews.length, 0)}</div>
            <div className="text-sm text-slate-600">전체 리뷰</div>
          </div>
          <div className="rounded-2xl bg-amber-50 p-4">
            <div className="text-2xl font-bold">{selectedRecipe ? avgRating(selectedRecipe.reviews) : "0.0"}</div>
            <div className="text-sm text-slate-600">선택 레시피 평점</div>
          </div>
        </CardContent>
      </Card>
    </motion.div>

    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <Card className="rounded-3xl border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">레시피 둘러보기</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="제목 또는 재료 검색"
                className="rounded-2xl pl-9"
              />
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`rounded-full px-3 py-1.5 text-sm transition ${
                  category === item ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredRecipes.map((recipe) => (
              <button
                key={recipe.id}
                onClick={() => setSelectedId(recipe.id)}
                className={`w-full rounded-3xl border p-3 text-left transition hover:shadow-sm ${
                  selectedRecipe?.id === recipe.id ? "border-orange-300 bg-orange-50/60" : "border-slate-200"
                }`}
              >
                <div className="flex gap-3">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="h-20 w-20 rounded-2xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <Badge variant="secondary" className="rounded-full">{recipe.category}</Badge>
                      <span className="text-xs text-slate-500">{recipe.author}</span>
                    </div>
                    <div className="truncate font-semibold">{recipe.title}</div>
                    <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" /> {recipe.time}</span>
                      <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {recipe.servings}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {recipe.likes}</span>
                      <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> {recipe.reviews.length}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}

            {filteredRecipes.length === 0 && (
              <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-slate-500">
                조건에 맞는 레시피가 없습니다.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedRecipe && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="overflow-hidden rounded-3xl border-0 shadow-sm">
            <div className="relative h-72 w-full overflow-hidden md:h-96">
              <img src={selectedRecipe.image} alt={selectedRecipe.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="mb-2 flex items-center gap-2">
                  <Badge className="rounded-full bg-white/20 text-white hover:bg-white/20">{selectedRecipe.category}</Badge>
                  <span className="text-sm opacity-90">by {selectedRecipe.author}</span>
                </div>
                <h2 className="text-3xl font-bold">{selectedRecipe.title}</h2>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm opacity-95">
                  <span className="flex items-center gap-1"><Clock3 className="h-4 w-4" /> {selectedRecipe.time}</span>
                  <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {selectedRecipe.servings}</span>
                  <span className="flex items-center gap-1"><Heart className="h-4 w-4" /> 좋아요 {selectedRecipe.likes}</span>
                  <span className="flex items-center gap-1"><Bookmark className="h-4 w-4" /> 저장 {selectedRecipe.saved}</span>
                </div>
              </div>
            </div>

            <CardContent className="p-6">
              <Tabs defaultValue="recipe" className="w-full">
                <TabsList className="mb-6 grid w-full grid-cols-2 rounded-2xl">
                  <TabsTrigger value="recipe" className="rounded-2xl">레시피</TabsTrigger>
                  <TabsTrigger value="reviews" className="rounded-2xl">리뷰</TabsTrigger>
                </TabsList>

                <TabsContent value="recipe" className="mt-0">
                  <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                    <Card className="rounded-3xl bg-slate-50 shadow-none">
                      <CardHeader>
                        <CardTitle className="text-lg">재료</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm text-slate-700">
                          {selectedRecipe.ingredients.map((item, idx) => (
                            <li key={idx} className="rounded-2xl bg-white px-4 py-3">• {item}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="rounded-3xl bg-slate-50 shadow-none">
                      <CardHeader>
                        <CardTitle className="text-lg">만드는 방법</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3 text-sm text-slate-700">
                          {selectedRecipe.steps.map((step, idx) => (
                            <div key={idx} className="flex gap-3 rounded-2xl bg-white p-4">
                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-orange-700">
                                {idx + 1}
                              </div>
                              <p className="leading-6">{step}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="reviews" className="mt-0">
                  <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                    <Card className="rounded-3xl bg-slate-50 shadow-none">
                      <CardHeader>
                        <CardTitle className="text-lg">리뷰 남기기</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Input
                          placeholder="닉네임"
                          value={reviewForm.user}
                          onChange={(e) => setReviewForm({ ...reviewForm, user: e.target.value })}
                        />
                        <div className="grid gap-3 md:grid-cols-2">
                          <Select
                            value={reviewForm.rating}
                            onValueChange={(value) => setReviewForm({ ...reviewForm, rating: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="평점" />
                            </SelectTrigger>
                            <SelectContent>
                              {["5", "4", "3", "2", "1"].map((score) => (
                                <SelectItem key={score} value={score}>
                                  {score}점
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          <Select
                            value={reviewForm.difficulty}
                            onValueChange={(value) => setReviewForm({ ...reviewForm, difficulty: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="난이도" />
                            </SelectTrigger>
                            <SelectContent>
                              {[
                                "쉬움",
                                "보통",
                                "어려움",
                              ].map((level) => (
                                <SelectItem key={level} value={level}>
                                  {level}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Textarea
                          placeholder="먹어본 후기를 간단히 남겨보세요"
                          value={reviewForm.text}
                          onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                          className="min-h-[130px]"
                        />
                        <Button onClick={handleAddReview} className="w-full rounded-2xl">리뷰 등록</Button>
                      </CardContent>
                    </Card>

                    <Card className="rounded-3xl bg-slate-50 shadow-none">
                      <CardHeader>
                        <div className="flex items-center justify-between gap-4">
                          <CardTitle className="text-lg">먹은 후기</CardTitle>
                          <div className="text-right">
                            <div className="text-2xl font-bold">{avgRating(selectedRecipe.reviews)}</div>
                            <div className="text-xs text-slate-500">{selectedRecipe.reviews.length}개 리뷰</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedRecipe.reviews.map((review) => (
                            <div key={review.id} className="rounded-2xl bg-white p-4">
                              <div className="mb-2 flex items-center justify-between gap-3">
                                <div>
                                  <div className="font-medium">{review.user}</div>
                                  <div className="mt-1 flex items-center gap-2">
                                    <RatingStars value={review.rating} />
                                    <span className="text-xs text-slate-500">난이도: {review.difficulty}</span>
                                  </div>
                                </div>
                              </div>
                              <Separator className="mb-3" />
                              <p className="text-sm leading-6 text-slate-700">{review.text}</p>
                            </div>
                          ))}

                          {selectedRecipe.reviews.length === 0 && (
                            <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-slate-500">
                              첫 리뷰를 남겨보세요.
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  </div>
</div>

); }
