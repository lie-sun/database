<?php
/**
 * Created by PhpStorm.
 * User: 14665
 * Date: 2018/8/17
 * Time: 15:57
 */
/**
$num = $_POST['num'];
class Experiment
{
    public function one(){
        $str = $_POST['str'];
        file_put_contents('./htmls/one.html',$str);
        echo "./htmls/one.html";
    }
    public function two(){
        $str = $_POST['str'];
        file_put_contents('./htmls/two.html',$str);
        echo "./htmls/two.html";
    }
    public function three(){
        $str = $_POST['str'];
        file_put_contents('./htmls/three.html',$str);
        echo "./htmls/three.html";
    }
    public function four(){
        $str = $_POST['str'];
        file_put_contents('./htmls/four.html',$str);
        echo "./htmls/four.html";
    }
    public function five(){
        $str = $_POST['str'];
        file_put_contents('./htmls/five.html',$str);
        echo "./htmls/five.html";
    }
    public function six(){
        $str = $_POST['str'];
        file_put_contents('./htmls/six.html',$str);
        echo "./htmls/six.html";
    }
    public function seven(){
        $str = $_POST['str'];
        file_put_contents('./htmls/seven.html',$str);
        echo "./htmls/seven.html";
    }
    public function eight(){
        $str = $_POST['str'];
        file_put_contents('./htmls/eight.html',$str);
        echo "./htmls/eight.html";
    }
}

$exp = new Experiment();
if($num == "one"){
    $exp->one();
}else if($num == "two"){
    $exp->two();
}else if($num == "three"){
    $exp->three();
}else if($num == "four"){
    $exp->four();
}else if($num == "five"){
    $exp->five();
}else if($num == "six"){
    $exp->six();
}else if($num == "seven"){
    $exp->seven();
}else if($num == "eight"){
    $exp->eight();
}**/
$str = $_POST['str'];
file_put_contents('./htmls/one.html',$str);
echo "./htmls/one.html";